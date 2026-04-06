"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { AlertCircle, TrendingUp, TrendingDown, Clock, Users, Calendar, Truck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'driving' | 'rest' | 'off-duty' | 'violation';
  hoursDriven: number;
  hoursRemaining: number;
  restHours: number;
  nextAvailable: string;
  location: string;
}

interface ScheduleRecommendation {
  driver: string;
  shift: string;
  duration: number;
  route: string;
  compliance: 'safe' | 'caution' | 'warning';
  notes: string;
}

const defaultDrivers: Driver[] = [
  { id: 'D001', name: 'John Smith', status: 'available', hoursDriven: 4, hoursRemaining: 7, restHours: 10, nextAvailable: 'Now', location: 'Terminal A' },
  { id: 'D002', name: 'Maria Garcia', status: 'driving', hoursDriven: 6, hoursRemaining: 5, restHours: 8, nextAvailable: '2:00 PM', location: 'En Route - Chicago' },
  { id: 'D003', name: 'Robert Chen', status: 'rest', hoursDriven: 0, hoursRemaining: 11, restHours: 4, nextAvailable: '4:00 PM', location: 'Rest Area B' },
  { id: 'D004', name: 'Sarah Johnson', status: 'available', hoursDriven: 2, hoursRemaining: 9, restHours: 12, nextAvailable: 'Now', location: 'Terminal A' },
  { id: 'D005', name: 'Mike Williams', status: 'off-duty', hoursDriven: 0, hoursRemaining: 11, restHours: 14, nextAvailable: 'Tomorrow 6:00 AM', location: 'Home' },
  { id: 'D006', name: 'Lisa Brown', status: 'violation', hoursDriven: 11, hoursRemaining: 0, restHours: 0, nextAvailable: 'Requires 10hr Rest', location: 'Terminal C' },
];

const weeklyData = [
  { day: 'Mon', shifts: 24, violations: 0, efficiency: 92 },
  { day: 'Tue', shifts: 26, violations: 1, efficiency: 88 },
  { day: 'Wed', shifts: 23, violations: 0, efficiency: 95 },
  { day: 'Thu', shifts: 28, violations: 2, efficiency: 85 },
  { day: 'Fri', shifts: 25, violations: 1, efficiency: 90 },
  { day: 'Sat', shifts: 18, violations: 0, efficiency: 94 },
  { day: 'Sun', shifts: 12, violations: 0, efficiency: 96 },
];

export default function DriverScheduleOptimizer() {
  const [drivers, setDrivers] = useState<Driver[]>(defaultDrivers);
  const [shiftStart, setShiftStart] = useState<string>('06:00');
  const [shiftDuration, setShiftDuration] = useState<number>(10);
  const [minRestHours, setMinRestHours] = useState<number>(10);
  const [maxDrivingHours, setMaxDrivingHours] = useState<number>(11);
  const [weeklyCycle, setWeeklyCycle] = useState<number>(60);

  const scheduleMetrics = useMemo(() => {
    const available = drivers.filter(d => d.status === 'available').length;
    const driving = drivers.filter(d => d.status === 'driving').length;
    const resting = drivers.filter(d => d.status === 'rest').length;
    const offDuty = drivers.filter(d => d.status === 'off-duty').length;
    const violations = drivers.filter(d => d.status === 'violation').length;
    const totalHoursAvailable = drivers.reduce((sum, d) => sum + d.hoursRemaining, 0);
    const avgUtilization = drivers.filter(d => d.status !== 'off-duty').reduce((sum, d) => sum + (d.hoursDriven / 11) * 100, 0) / (drivers.length - offDuty);

    return {
      available,
      driving,
      resting,
      offDuty,
      violations,
      totalHoursAvailable: Math.round(totalHoursAvailable * 10) / 10,
      avgUtilization: Math.round(avgUtilization * 10) / 10,
      coverageRate: Math.round(((available + driving) / drivers.length) * 100)
    };
  }, [drivers]);

  const statusDistribution = useMemo(() => [
    { name: 'Available', value: scheduleMetrics.available, color: '#2E8B57' },
    { name: 'Driving', value: scheduleMetrics.driving, color: '#0F4C81' },
    { name: 'Rest', value: scheduleMetrics.resting, color: '#FFA500' },
    { name: 'Off-Duty', value: scheduleMetrics.offDuty, color: '#888888' },
    { name: 'Violation', value: scheduleMetrics.violations, color: '#FF6B6B' },
  ], [scheduleMetrics]);

  const recommendations: ScheduleRecommendation[] = useMemo(() => {
    const recs: ScheduleRecommendation[] = [];
    const availableDrivers = drivers.filter(d => d.status === 'available' && d.hoursRemaining >= 4);

    availableDrivers.sort((a, b) => b.hoursRemaining - a.hoursRemaining);

    if (availableDrivers.length > 0) {
      recs.push({
        driver: availableDrivers[0].name,
        shift: `${shiftStart} - ${String(parseInt(shiftStart.split(':')[0]) + shiftDuration).padStart(2, '0')}:00`,
        duration: shiftDuration,
        route: 'Route A: LA -> Phoenix',
        compliance: availableDrivers[0].hoursRemaining >= shiftDuration ? 'safe' : 'caution',
        notes: availableDrivers[0].hoursRemaining >= shiftDuration 
          ? 'Full shift available' 
          : `Limited to ${availableDrivers[0].hoursRemaining} hours driving`
      });
    }

    if (availableDrivers.length > 1) {
      recs.push({
        driver: availableDrivers[1].name,
        shift: `${shiftStart} - ${String(parseInt(shiftStart.split(':')[0]) + shiftDuration).padStart(2, '0')}:00`,
        duration: shiftDuration,
        route: 'Route B: LA -> San Diego',
        compliance: availableDrivers[1].hoursRemaining >= shiftDuration ? 'safe' : 'caution',
        notes: availableDrivers[1].hoursRemaining >= shiftDuration 
          ? 'Full shift available' 
          : `Limited to ${availableDrivers[1].hoursRemaining} hours driving`
      });
    }

    const cautionDrivers = drivers.filter(d => d.hoursRemaining > 0 && d.hoursRemaining < 4 && d.status !== 'violation');
    if (cautionDrivers.length > 0) {
      recs.push({
        driver: cautionDrivers[0].name,
        shift: 'Short Assignment',
        duration: cautionDrivers[0].hoursRemaining,
        route: 'Local Delivery',
        compliance: 'warning',
        notes: 'Limited hours - assign local routes only'
      });
    }

    return recs;
  }, [drivers, shiftStart, shiftDuration]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'driving': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'rest': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'off-duty': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'violation': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case 'safe': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'caution': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-[#0F4C81]" />
            Driver Schedule Optimizer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Optimize driver schedules while maintaining HOS compliance and maximizing fleet utilization
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Builder</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{scheduleMetrics.available}</p>
                    <p className="text-sm text-muted-foreground">Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Truck className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{scheduleMetrics.driving}</p>
                    <p className="text-sm text-muted-foreground">On Road</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{scheduleMetrics.resting}</p>
                    <p className="text-sm text-muted-foreground">Resting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{scheduleMetrics.violations}</p>
                    <p className="text-sm text-muted-foreground">Violations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{scheduleMetrics.avgUtilization}%</p>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Driver Status and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Driver</th>
                        <th className="text-center p-2">Status</th>
                        <th className="text-center p-2">Hours Driven</th>
                        <th className="text-center p-2">Remaining</th>
                        <th className="text-center p-2">Next Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map((driver) => (
                        <tr key={driver.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-xs text-muted-foreground">{driver.location}</p>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(driver.status)}`}>
                              {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(driver.hoursDriven / 11) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs">{driver.hoursDriven}/11h</span>
                          </td>
                          <td className="p-2 text-center font-medium">{driver.hoursRemaining}h</td>
                          <td className="p-2 text-center text-sm">{driver.nextAvailable}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <p className="text-2xl font-bold text-blue-600">{scheduleMetrics.totalHoursAvailable}h</p>
                      <p className="text-sm text-muted-foreground">Total Available Hours</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-2xl font-bold text-green-600">{scheduleMetrics.coverageRate}%</p>
                      <p className="text-sm text-muted-foreground">Coverage Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {/* Schedule Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Shift Start Time</Label>
                  <Input
                    type="time"
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shift Duration (hrs)</Label>
                  <Input
                    type="number"
                    value={shiftDuration}
                    onChange={(e) => setShiftDuration(Number(e.target.value))}
                    min={1}
                    max={14}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Rest Hours</Label>
                  <Input
                    type="number"
                    value={minRestHours}
                    onChange={(e) => setMinRestHours(Number(e.target.value))}
                    min={8}
                    max={11}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Driving Hours</Label>
                  <Input
                    type="number"
                    value={maxDrivingHours}
                    onChange={(e) => setMaxDrivingHours(Number(e.target.value))}
                    min={8}
                    max={11}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weekly Cycle (hrs)</Label>
                  <Input
                    type="number"
                    value={weeklyCycle}
                    onChange={(e) => setWeeklyCycle(Number(e.target.value))}
                    min={50}
                    max={70}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Assignments</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimal driver assignments based on availability and compliance
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getComplianceIcon(rec.compliance)}
                      <div>
                        <p className="font-semibold">{rec.driver}</p>
                        <p className="text-sm text-muted-foreground">{rec.shift} • {rec.route}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{rec.duration}h shift</p>
                      <p className="text-sm text-muted-foreground">{rec.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Shift Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Shift Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="shifts" fill="#0F4C81" name="Shifts" />
                  <Bar yAxisId="left" dataKey="violations" fill="#FF6B6B" name="Violations" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#2E8B57" strokeWidth={2} name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* HOS Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Hours of Service (HOS) Compliance Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">11-Hour Driving Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    May not drive beyond the 14th consecutive hour after coming on duty, following 10 consecutive hours off duty.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">14-Hour On-Duty Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    The 14-hour on-duty limit cannot be extended by off-duty time for meals, fuel stops, or rest breaks.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">30-Minute Break</h4>
                  <p className="text-sm text-muted-foreground">
                    Required after 8 cumulative hours of driving time. Can be satisfied by any off-duty or sleeper berth period.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">60/70-Hour Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    May not drive after 60/70 hours on duty in 7/8 consecutive days. A 34-hour restart resets the weekly total.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">10-Hour Off-Duty</h4>
                  <p className="text-sm text-muted-foreground">
                    Must have 10 consecutive hours off duty before driving again. May be in sleeper berth or off duty.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sleeper Berth Provision</h4>
                  <p className="text-sm text-muted-foreground">
                    May split sleeper berth time into two periods if neither is less than 2 hours (8+2 or 7+3 split).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violations Alert */}
          {scheduleMetrics.violations > 0 && (
            <Card className="border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Active Compliance Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {drivers.filter(d => d.status === 'violation').map(driver => (
                    <div key={driver.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{driver.name}</p>
                          <p className="text-sm text-muted-foreground">{driver.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-medium">11h driving limit exceeded</p>
                          <p className="text-sm text-muted-foreground">Requires 10-hour rest period</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Compliance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="violations" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} name="Violations" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {/* Optimization Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Schedule Optimization Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Maximize Driver Utilization</h4>
                <ul className="text-sm space-y-1 text-green-600 dark:text-green-300">
                  <li>• Assign drivers with most available hours to longest routes first</li>
                  <li>• Use staggered shift starts to extend coverage windows</li>
                  <li>• Implement relay driving for time-critical shipments</li>
                  <li>• Cross-train drivers on multiple route types for flexibility</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Minimize Compliance Risk</h4>
                <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-300">
                  <li>• Build in buffer time for unexpected delays</li>
                  <li>• Monitor cumulative weekly hours proactively</li>
                  <li>• Use ELD alerts for real-time compliance tracking</li>
                  <li>• Schedule mandatory breaks during optimal traffic periods</li>
                </ul>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Reduce Deadhead Miles</h4>
                <ul className="text-sm space-y-1 text-purple-600 dark:text-purple-300">
                  <li>• Match outbound loads with return freight</li>
                  <li>• Use load boards for backhaul opportunities</li>
                  <li>• Coordinate with shipper networks for continuous moves</li>
                  <li>• Analyze route efficiency weekly and adjust</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#0F4C81]">{weeklyData.reduce((sum, d) => sum + d.shifts, 0)}</p>
                  <p className="text-sm text-muted-foreground">Weekly Shifts Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#2E8B57]">{Math.round(weeklyData.reduce((sum, d) => sum + d.efficiency, 0) / weeklyData.length)}%</p>
                  <p className="text-sm text-muted-foreground">Avg Efficiency Score</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-500">{weeklyData.reduce((sum, d) => sum + d.violations, 0)}</p>
                  <p className="text-sm text-muted-foreground">Weekly Violations</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What are the current HOS regulations for truck drivers?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Federal HOS regulations include: 11-hour driving limit after 10 consecutive hours off duty, 14-hour on-duty window, 30-minute break requirement after 8 hours of driving, and 60/70-hour weekly limits. These rules apply to property-carrying commercial motor vehicles operating in interstate commerce.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How does the 34-hour restart work?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Drivers may restart their 60/70-hour weekly clock after taking 34 consecutive hours off duty. This restart provision allows drivers to reset their weekly on-duty total and begin a new 7/8-day period. The restart must include two periods between 1:00 AM and 5:00 AM for teams operating under certain conditions.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What happens if a driver exceeds HOS limits?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Violations can result in fines ranging from $1,000 to $11,000 per violation, driver out-of-service orders, and carrier safety rating downgrades. Repeated violations can lead to CDL suspension. Our system proactively monitors hours and alerts before limits are reached.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How can I improve driver utilization rates?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Key strategies include: optimizing route assignments based on driver availability windows, implementing relay systems for long-haul routes, using predictive scheduling to anticipate needs, and ensuring proper rest scheduling to maximize available driving hours. Target 85-90% utilization for optimal efficiency.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">What is the split sleeper berth provision?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The split sleeper berth provision allows drivers to split their required 10-hour off-duty period into two periods: one of at least 7 consecutive hours in the sleeper berth and another of at least 2 consecutive hours either off duty or in the sleeper berth. This provides flexibility while maintaining required rest.
                  </p>
                </details>
                <details className="p-4 border rounded-lg">
                  <summary className="font-semibold cursor-pointer">How do I handle unexpected delays affecting HOS?</summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Build buffer time into schedules for unforeseen delays. Use the adverse driving conditions exception (up to 2 additional hours) when weather or traffic causes unexpected delays. Maintain communication with dispatch to find safe parking and reschedule deliveries if necessary. Never pressure drivers to violate HOS.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-[#0F4C81]/20 bg-[#0F4C81]/5">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Pro Tips for Schedule Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Review driver availability 24 hours in advance to plan optimal assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Maintain 10-15% driver capacity buffer for unexpected demand or emergencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Implement driver preference surveys to improve satisfaction and retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E8B57] font-bold">•</span>
                  <span>Use ELD data to identify patterns and optimize recurring routes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
