 "use client";
 import NoData from "../../assets/nodata.png";
 
import Image from "next/image";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Graph = ({ dt }) => {
  return (
    <ResponsiveContainer width='100%' height={400}>
      {dt?.length > 0 ? (
        <AreaChart data={dt}>
          <XAxis dataKey='_id' />
          <YAxis />
          <Tooltip />
          <Area
            type='monotone'
            dataKey='Total'
            stroke='#8884d8'
            fill='#8884d8'
          />
        </AreaChart>
      ) : (
        <Image
          src={NoData}
          alt='No Data'
          className='w-full h-full opacity-50'
        />
      )}
    </ResponsiveContainer>
  );
};

export default Graph;