import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { headers } from 'next/headers';

import { ProgressChart } from "@/components/progress/progress-chart";
import { ProgressItemGroup } from "@/components/progress/progress-item";
import { TotalHoursInfo } from "@/components/progress/total-hours-info";
import {
    fetchCourseAttendanceRate,
    fetchDanceCategoryStats,
    fetchInstructorStats,
    fetchMasteredDanceCategories
} from "@/lib/api/enroll";
import {
    calculateTotalHours,
    transformCourseAttendanceToProgressItems,
    transformDanceCategoryStatsToChartData,
    transformInstructorStatsToChartData,
    transformMasteredCategoriesToProgressItems
} from "@/lib/utils/progress-transformers";

const ongoingCoursesEmptyState = {
    title: "No ongoing courses",
    description: "You don't participate in any course yet. Feel free to join one!"
};

const masteredEmptyState = {
    title: "No mastered dance categories",
    description: "You haven't mastered any dance category yet."
};

export default async function Page() {
    const cookie = (await headers()).get('cookie') ?? "";

    const danceCategoryStats = await fetchDanceCategoryStats(cookie);
    const instructorStats = await fetchInstructorStats(cookie);
    const courseAttendanceRate = await fetchCourseAttendanceRate(cookie);
    const masteredDanceCategories = await fetchMasteredDanceCategories(cookie);

    const categoryChartData = transformDanceCategoryStatsToChartData(danceCategoryStats.data?.spentHoursStatsList || []);
    const instructorChartData = transformInstructorStatsToChartData(instructorStats.data?.spentHoursStatsList || []);
    const ongoingCourses = transformCourseAttendanceToProgressItems(courseAttendanceRate.data?.courseAttendancesRates || []);
    const mastered = transformMasteredCategoriesToProgressItems(masteredDanceCategories.data || []);
    const totalHours = calculateTotalHours(danceCategoryStats.data?.spentHoursStatsList || []);

    return (
        <div className="flex h-full p-4 flex-col space-y-4">
            <h1 className="text-4xl font-bold">My progress</h1>
            <div className="lg:col-span-2">
                <TotalHoursInfo hours={totalHours} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ongoing courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProgressItemGroup data={ongoingCourses} emptyStateTitle={ongoingCoursesEmptyState.title} emptyStateDescription={ongoingCoursesEmptyState.description} />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Mastered dance categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProgressItemGroup data={mastered} emptyStateTitle={masteredEmptyState.title} emptyStateDescription={masteredEmptyState.description} />
                        </CardContent>
                    </Card>
                </div>
                {categoryChartData.length > 0 && <ProgressChart data={categoryChartData} title="Dance categories progress" />}
                {instructorChartData.length > 0 && <ProgressChart data={instructorChartData} title="Time spent with instructors" />}
            </div>
        </div>
    );
}
