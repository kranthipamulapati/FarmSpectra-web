import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, CloudRain, Wind, Droplets, Thermometer, BarChart3, AlertTriangle, Badge, LineChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Sun, CloudSun, CloudDrizzle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const weatherData = [
  {
    day: "Mon",
    temp: 24,
    tempMin: 18,
    tempMax: 27,
    rain: 0,
    wind: 8,
    icon: Sun,
    description: "Sunny",
  },
  {
    day: "Tue",
    temp: 22,
    tempMin: 17,
    tempMax: 25,
    rain: 0,
    wind: 10,
    icon: CloudSun,
    description: "Partly Cloudy",
  },
  {
    day: "Wed",
    temp: 20,
    tempMin: 16,
    tempMax: 23,
    rain: 30,
    wind: 15,
    icon: CloudRain,
    description: "Rain",
  },
  {
    day: "Thu",
    temp: 19,
    tempMin: 15,
    tempMax: 22,
    rain: 60,
    wind: 18,
    icon: CloudRain,
    description: "Heavy Rain",
  },
  {
    day: "Fri",
    temp: 21,
    tempMin: 16,
    tempMax: 24,
    rain: 20,
    wind: 12,
    icon: CloudDrizzle,
    description: "Light Rain",
  },
  {
    day: "Sat",
    temp: 23,
    tempMin: 18,
    tempMax: 26,
    rain: 0,
    wind: 9,
    icon: CloudSun,
    description: "Partly Cloudy",
  },
  {
    day: "Sun",
    temp: 25,
    tempMin: 19,
    tempMax: 28,
    rain: 0,
    wind: 7,
    icon: Sun,
    description: "Sunny",
  },
]

const diseaseData = [
  {
    id: 1,
    crop: "Wheat",
    disease: "Powdery Mildew",
    affectedArea: "2.3 hectares",
    severity: "High",
    detectedDate: "2023-06-15",
  },
  {
    id: 2,
    crop: "Corn",
    disease: "Leaf Blight",
    affectedArea: "1.5 hectares",
    severity: "Medium",
    detectedDate: "2023-06-18",
  },
  {
    id: 3,
    crop: "Soybean",
    disease: "Rust",
    affectedArea: "0.8 hectares",
    severity: "Low",
    detectedDate: "2023-06-20",
  },
  {
    id: 4,
    crop: "Rice",
    disease: "Blast",
    affectedArea: "1.2 hectares",
    severity: "Medium",
    detectedDate: "2023-06-22",
  },
];

const yieldData = [
  { year: "2018", estimated: 4.2, actual: 4.0, historical: 3.8 },
  { year: "2019", estimated: 4.5, actual: 4.3, historical: 4.0 },
  { year: "2020", estimated: 4.7, actual: 4.5, historical: 4.2 },
  { year: "2021", estimated: 5.0, actual: 4.8, historical: 4.4 },
  { year: "2022", estimated: 5.2, actual: 5.0, historical: 4.6 },
  { year: "2023", estimated: 5.5, actual: 5.3, historical: 4.8 },
  { year: "2024", estimated: 5.8, actual: null, historical: 5.0 },
]

const chartConfig = {
  estimated: {
    label: "Estimated Yield",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual Yield",
    color: "hsl(var(--chart-2))",
  },
  historical: {
    label: "Historical Average",
    color: "hsl(var(--chart-3))",
  },
}

const harvestData = [
  { crop: "Wheat", readiness: 85, daysToHarvest: 15 },
  { crop: "Corn", readiness: 65, daysToHarvest: 35 },
  { crop: "Soybean", readiness: 40, daysToHarvest: 60 },
  { crop: "Rice", readiness: 75, daysToHarvest: 25 },
  { crop: "Barley", readiness: 90, daysToHarvest: 10 },
]

const harvestChartConfig = {
  readiness: {
    label: "Readiness (%)",
    color: "hsl(var(--chart-1))",
  },
}

const UserDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Overview</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3 w-full">
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">24°C</div>
                <div className="text-sm text-muted-foreground">Sunny</div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                <div className="flex flex-col items-center p-1 rounded-md bg-muted/50">
                  <Droplets className="h-4 w-4 mb-1 text-blue-500" />
                  <span className="text-xs font-medium">65%</span>
                  <span className="text-xs text-muted-foreground">Humidity</span>
                </div>
                <div className="flex flex-col items-center p-1 rounded-md bg-muted/50">
                  <CloudRain className="h-4 w-4 mb-1 text-blue-400" />
                  <span className="text-xs font-medium">2mm</span>
                  <span className="text-xs text-muted-foreground">Rainfall</span>
                </div>
                <div className="flex flex-col items-center p-1 rounded-md bg-muted/50">
                  <Wind className="h-4 w-4 mb-1 text-blue-300" />
                  <span className="text-xs font-medium">12 km/h</span>
                  <span className="text-xs text-muted-foreground">Wind</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Health Status</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78% Healthy</div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Healthy</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-1 bg-muted" />
              <div className="flex items-center justify-between text-xs">
                <span>Stressed</span>
                <span>15%</span>
              </div>
              <Progress value={15} className="h-1 bg-muted" />
              <div className="flex items-center justify-between text-xs">
                <span>Diseased</span>
                <span>7%</span>
              </div>
              <Progress value={7} className="h-1 bg-muted" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yield Estimation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span>Estimated vs Expected</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2 bg-muted" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Estimated: 4.8 tons/hectare</div>
            <div className="text-xs text-muted-foreground">Expected: 5.2 tons/hectare</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs text-amber-500">
                <AlertTriangle className="mr-1 h-3 w-3" />
                <span>Weather: Heavy rain expected</span>
              </div>
              <div className="flex items-center text-xs text-red-500">
                <AlertTriangle className="mr-1 h-3 w-3" />
                <span>Disease: Powdery mildew detected</span>
              </div>
              <div className="flex items-center text-xs text-amber-500">
                <AlertTriangle className="mr-1 h-3 w-3" />
                <span>Irrigation: Zone 3 low pressure</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>Next 7 days forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weatherData.map((day) => (
                  <Card key={day.day} className="overflow-hidden">
                    <CardContent className="p-2">
                      <div className="text-center flex flex-col h-[140px]">
                        <div className="text-sm font-medium mb-1">{day.day}</div>
                        <day.icon className="mx-auto h-8 w-8 mb-1" />
                        <div className="text-xs text-muted-foreground h-8 flex items-center justify-center">
                          {day.description}
                        </div>
                        <div className="text-sm font-medium h-6 flex items-center justify-center">{day.temp}°C</div>
                        <div className="text-xs text-muted-foreground h-6 flex items-center justify-center">
                          {day.tempMin}° / {day.tempMax}°
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Disease Detection</CardTitle>
            <CardDescription>Affected crops and areas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Affected Area</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Detected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diseaseData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.crop}</TableCell>
                    <TableCell>{row.disease}</TableCell>
                    <TableCell>{row.affectedArea}</TableCell>
                    <TableCell>
                      <Badge
                        variant={row.severity === "High" ? "destructive" : row.severity === "Medium" ? "default" : "outline"}
                      >
                        {row.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.detectedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Harvest Readiness</CardTitle>
            <CardDescription>By crop and field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={harvestChartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={harvestData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="crop" width={100} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="readiness" fill="hsl(var(--chart-1))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Yield Estimation</CardTitle>
            <CardDescription>Estimated vs. Historical Data</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default memo(UserDashboard);
