import { Prisma } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

const PASSWORD_SALT_ROUNDS = 12;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Invalid registration details." },
      { status: 400 },
    );
  }

  const { email, password, role } = parsed.data;
  const passwordHash = await hash(password, PASSWORD_SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
