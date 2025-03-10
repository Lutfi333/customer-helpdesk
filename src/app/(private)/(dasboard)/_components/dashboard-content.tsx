"use client";
import { Card, CardBody, Spinner, DateRangePicker } from "@heroui/react";
import { Fragment, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { DateTime, Interval } from "luxon";
import { DateValue, RangeValue } from "@heroui/react";
import {
  useDashboard,
  useDashboardBarChart,
  useDashboardChart,
} from "@/services/dashboard";
type ChartData = {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: string[];
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
};

export default function DashboardContent() {
  const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
    loading: () => <Spinner />,
  });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDateRangeChange = (value: RangeValue<DateValue> | null) => {
    if (value) {
      const { start, end } = value;

      if (start && end) {
        setStartDate(DateTime.fromISO(start.toString()).toISO() ?? "");
        const inclusiveEndDate =
          DateTime.fromISO(end.toString()).plus({ days: 1 }).toISO() ?? "";
        setEndDate(inclusiveEndDate);
      } else {
        setStartDate("");
        setEndDate("");
      }
    }
  };

  const dashboardParams = useMemo(() => {
    return {
      startDate: startDate,
      endDate: endDate,
    };
  }, [startDate, endDate]);

  const [chartState, setChartState] = useState<ChartData>({
    options: {
      chart: {
        id: "",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    },
    series: [
      {
        name: "Open Ticket",
        data: [],
      },
      {
        name: "Closed Ticket",
        data: [],
      },
      {
        name: "In Progress Ticket",
        data: [],
      },
    ],
  });

  const { data: dashboard, isFetching, isError } = useDashboard();

  const {
    data: dashboardChart,
    isFetching: isLoadingChart,
    isError: isErrorChart,
  } = useDashboardChart();

  const {
    data: dashboardBarchart,
    isFetching: isLoadingBarchart,
    isError: isErrorBarchart,
  } = useDashboardBarChart(dashboardParams);

  const secondsToHms = (d: number) => {
    const hours = Math.floor(d / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor(d % 60);
    const formatTime = (unit: number) => (unit < 10 ? `0${unit}` : unit);
    return `${formatTime(hours)}:${formatTime(minutes)}`;
  };

  useEffect(() => {
    if (dashboardChart?.data) {
      const chartData = Object.entries(dashboardChart.data).map(
        ([, value]) => value,
      );
      const open = chartData.map((d) => d.open || 0);
      const inprogress = chartData.map((d) => d.in_progress || 0);
      const close = chartData.map((d) => d.close || 0);
      const day = chartData.map((d) =>
        d.dayName ? d.dayName.charAt(0).toUpperCase() + d.dayName.slice(1) : "",
      );

      if (day.length && open.length && inprogress.length && close.length) {
        setChartState((prevState) => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              categories: day,
            },
            chart: {
              id: `Customer-data-by-day-${DateTime.now().toFormat("dd-MM-yyyy")}`,
            },
          },
          series: [
            {
              name: "Open Ticket",
              data: open,
            },
            {
              name: "In Progress Ticket",
              data: inprogress,
            },
            {
              name: "Closed Ticket",
              data: close,
            },
          ],
        }));
      }
    }
  }, [dashboardChart]);

  const filteredBarChartData = useMemo(() => {
    if (!dashboardBarchart?.data) return null;

    if (!startDate && !endDate) {
      return {
        options: {
          chart: {
            id: `Customer-data-average-${DateTime.now().toFormat("dd-MM-yyyy")}`,
          },
          xaxis: {
            categories: dashboardBarchart.data.map((d) =>
              DateTime.fromISO(d.date).toFormat("MMM-dd"),
            ),
          },
        },
        series: [
          {
            name: "Average Solving Time (Minutes)",
            data: dashboardBarchart.data.map((d) =>
              Number.parseFloat((d.averageDuration / 60 / 60).toFixed(2)),
            ),
          },
        ],
      };
    }

    let start = DateTime.fromISO(startDate ?? "");
    let end = DateTime.fromISO(endDate ?? "");

    if (startDate === "" && endDate !== "") {
      start = DateTime.fromISO(endDate).minus({ days: 7 });
    }

    if (endDate === "" && startDate !== "") {
      end = DateTime.fromISO(startDate).plus({ days: 7 });
    }
    const interval = Interval.fromDateTimes(start, end);
    const allDates = interval
      .splitBy({ days: 1 })
      .map((d) => (d.start as DateTime).toISODate());

    const dataMap = new Map(
      dashboardBarchart?.data?.map((d) => [
        DateTime.fromISO(d.date).toFormat("yyyy-MM-dd"),
        d.averageDuration / 60 / 60,
      ]) || [],
    );

    const filteredData = allDates.map((date) => ({
      date,
      averageDuration: dataMap.get(date ?? "") || 0,
    }));

    return {
      options: {
        chart: {
          id: `Customer-data-average-${DateTime.now().toFormat("dd-MM-yyyy")}`,
        },
        xaxis: {
          categories: filteredData.map((d) =>
            DateTime.fromISO(d.date ?? "").toFormat("MMM-dd"),
          ),
        },
      },
      series: [
        {
          name: "Average Solving Time (Hours)",
          data: filteredData.map((d) =>
            Number.parseFloat(d.averageDuration.toFixed(2)),
          ),
        },
      ],
    };
  }, [dashboardBarchart, startDate, endDate]);

  return (
    <Fragment>
      <div className="pt-4 flex gap-3">
        <div className="w-1/4">
          <Card>
            <CardBody className="text-center">
              <p className="text-sm">Total Ticket</p>
              <p className="pt-1 text-blue-500 font-bold text-3xl">
                {dashboard?.data?.totalTicket ?? ""}
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="w-1/4">
          <Card>
            <CardBody className="text-center">
              <p className="text-sm">Open Ticket</p>
              <p className="pt-1 text-orange-400 font-bold text-3xl">
                {dashboard?.data?.totalTicketOpen ?? ""}
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="w-1/4">
          <Card>
            <CardBody className="text-center">
              <p className="text-sm">In Progress Ticket</p>
              <p className="pt-1 text-purple-400 font-bold text-3xl">
                {dashboard?.data?.totalTicketInProgress ?? ""}
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="w-1/4">
          <Card>
            <CardBody className="text-center">
              <p className="text-sm">Closed Ticket</p>
              <p className="pt-1 text-red-400 font-bold text-3xl">
                {dashboard?.data?.totalTicketClosed ?? ""}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="pt-4 w-full">
        <Card>
          <CardBody>
            <p className="pl-4 text-sm">Ticket by a day of week</p>
            <Chart
              aria-label="Ticket by a day of week"
              options={chartState.options}
              series={chartState.series}
              type="line"
              width="99%"
              height={400}
            />
          </CardBody>
        </Card>
      </div>

      <div className="pt-4 w-full">
        <Card>
          <CardBody>
            <div className="mb-4">
              <DateRangePicker
                label="Filter Date Range"
                className="max-w-xs"
                onChange={handleDateRangeChange}
              />
            </div>
            <p className="pl-4 text-sm">Average solving time per day (Hours)</p>
            {filteredBarChartData && (
              <Chart
                aria-label="Average Solving Time per Day (Bar)"
                options={{
                  ...filteredBarChartData.options,
                  stroke: { curve: "smooth" },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.4,
                      stops: [0, 90, 100],
                    },
                  },
                }}
                series={filteredBarChartData.series}
                type="area"
                width="99%"
                height={400}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </Fragment>
  );
}
