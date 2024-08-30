import React from "react";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import NotFound from "@/app/_404";
import Stats from "@/components/stats/Stats";
import Graph from "@/components/graph/Graph";
import { subDays, formatISO } from "date-fns";

// Fetch user data and session server-side
const getUserData = async (id, userEmail) => {
  // Fetch the user data along with the required statistics
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
      Following: {
        select: {
          followerId: true,
        },
      },
    },
  });

  if (user) {
    // Calculate followers and following count
    const followersCount = await prisma.following.count({
      where: { followingId: id },
    });

    const followingCount = await prisma.following.count({
      where: { followerId: userEmail },
    });

    const postsCount = user.posts.length;
    const viewsCount = user.posts.reduce(
      (total, post) => total + post.views,
      0
    );

    return {
      ...user,
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
      views: viewsCount,
    };
  }

  return null;
};

// Fetch analytics data for the last 28 days
const fetchChartData = async (userEmail) => {
  try {
    const startDate = subDays(new Date(), 28);

    const viewsData = await prisma.post.findMany({
      where: {
        userEmail: userEmail,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        views: true,
      },
    });

    const aggregatedData = viewsData.reduce((acc, view) => {
      const date = formatISO(view.createdAt, { representation: "date" });
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += view.views;
      return acc;
    }, {});

    const formattedData = Object.keys(aggregatedData).map((date) => ({
      _id: date,
      Total: aggregatedData[date],
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching views data:", error);
    return []; // Return an empty array if there's an error
  }
};

const Analytics = async ({ params }) => {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  const user = await getUserData(id, session.user.email);
  const chartData = await fetchChartData(session.user.email);

  if (!user) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  return (
    <div className="w-full container">
      <div>
        <Stats user={user} />
      </div>
      <div className="w-full py-8">
        <p className="py-5 text-base font-medium">Views Stats for last 28 days</p>
        <Graph dt={chartData} />
      </div>
    </div>
  );
};

export default Analytics;
