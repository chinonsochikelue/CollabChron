"use client";

import CountUp from "react-countup";
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { BsPostcardHeart, BsEye } from "react-icons/bs";

const Stats = ({ user }) => {
  const stats = [
    {
      num: user?.followers,
      text: "FOLLOWERS",
      icon: FaUsersCog,
    },
    {
      num: user?.following,
      text: "FOLLOWING",
      icon: FaUsers,
    },
    {
      num: user?.posts,
      text: "TOTAL POSTS",
      icon: BsPostcardHeart,
    },
    {
      num: user?.views,
      text: "TOTAL VIEWS",
      icon: BsEye,
    },
  ];

  return (
    <section className="pt-4 pb-12 xl:pt-0 xl:pb-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="border border-gray-400 rounded-md p-4 flex flex-col justify-between shadow-md"
            >
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-black/80 dark:text-slate-300">
                  {item.text}
                </p>
                <item.icon className="text-xl text-gray-600 dark:text-slate-400" />
                
              </div>

              <CountUp
                end={item.num}
                duration={5}
                delay={2}
                className="text-4xl font-extrabold mt-2"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;

