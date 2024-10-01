import { getAnalytics } from "@/app/services/Analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chartmy from "@/components/ui/Chartmy";

import { formatPrice } from "@/lib/PriceFormat";
import React from "react";


const AnalyticsPage = async () => {
  const data = await getAnalytics();
  return (
    <div className="p-6">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
        <Card className=" ">
          <CardHeader className=" flex flex-row justify-between  items-center space-y-0 pb-2 ">
            <CardTitle className="  font-medium text-sm">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <span className=" text-2xl font-bold ">{data?.totlaSales}</span>
          </CardContent>
        </Card>
        <Card className=" ">
          <CardHeader className="flex flex-row justify-between  items-center space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Revnue</CardTitle>
          </CardHeader>
          <CardContent>
            <span className=" text-2xl font-bold ">
              {formatPrice(data?.totalRevenue || 0)}
            </span>
          </CardContent>
        </Card>
      </div>
      <Chartmy data={data?.data!} />
    </div>
  );
};

export default AnalyticsPage;
