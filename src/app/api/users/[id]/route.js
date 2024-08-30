import prisma from "@/lib/prismadb";

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    name,
    email,
    image,
    about,
    website,
    twitter,
    linkedin,
    facebook,
    github,
    instagram,
    youtube,
    buymeacoffee,
  } = await request.json();

  try {
    // Update the user data in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        image,
        about,
        twitter,
        linkedin,
        facebook,
        github,
        instagram,
        youtube,
        website,
        buymeacoffee,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response("Error updating user", { status: 500 });
  }
}