'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Users, BookOpen, TrendingUp, Calendar, Bell } from 'lucide-react'

interface StudentOverview {
  id: string
  name: string
  course: string
  progress: number
  last_active: string
}

interface CourseStats {
  course_name: string
  enrolled_students: number
  avg_progress: number
  completion_rate: number
}

export default function InstructorDashboard() {
  const { profile } = useAuth()
  const [students, setStudents] = useState<StudentOverview[]>([])
  const [courseStats, setCourseStats] = useState<CourseStats[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadDashboardData()
      setupRealtimeUpdates()
    }
  }, [profile])

  const loadDashboardData = async () => {
    try {
      // Load student progress overview
      const { data: progressData } = await supabase
        .from('student_progress')
        .select(`
          id,
          progress,
          course_name,
          last_updated,
          profiles!student_progress_student_id_fkey (
            full_name
          )
        `)
        .order('last_updated', { ascending: false })
        .limit(10)

      if (progressData) {
        const formattedStudents = progressData.map(item => ({
          id: item.id,
          name: item.profiles?.full_name || 'Unknown Student',
          course: item.course_name,
          progress: item.progress,
          last_active: item.last_updated
        }))
        setStudents(formattedStudents)
      }

      // Load course statistics
      const { data: statsData } = await supabase
        .from('student_progress')
        .select('course_name, progress')

      if (statsData) {
        const statsMap = new Map<string, { total: number, sum: number, completed: number }>()
        
        statsData.forEach(item => {
          const existing = statsMap.get(item.course_name) || { total: 0, sum: 0, completed: 0 }
          existing.total++
          existing.sum += item.progress
          if (item.progress === 100) existing.completed++
          statsMap.set(item.course_name, existing)
        })

        const formattedStats = Array.from(statsMap.entries()).map(([course, data]) => ({
          course_name: course,
          enrolled_students: data.total,
          avg_progress: Math.round(data.sum / data.total),
          completion_rate: Math.round((data.completed / data.total) * 100)
        }))

        setCourseStats(formattedStats)
      }

      // Load recent activities
      const { data: activityData } = await supabase
        .from('student_activities')
        .select(`
          id,
          type,
          description,
          timestamp,
          profiles!student_activities_student_id_fkey (
            full_name
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(10)

      if (activityData) {
        setRecentActivities(activityData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeUpdates = () => {
    // Subscribe to progress updates
    const progressChannel = supabase
      .channel('instructor_progress_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_progress',
        },
        (payload) => {
          console.log('Student progress update:', payload)
          loadDashboardData()
        }
      )
      .subscribe()

    // Subscribe to activity updates
    const activityChannel = supabase
      .channel('instructor_activity_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_activities',
        },
        (payload) => {
          console.log('New student activity:', payload)
          setRecentActivities(prev => [payload.new, ...prev.slice(0, 9)])
        }
      )
      .subscribe()

    return () => {
      progressChannel.unsubscribe()
      activityChannel.unsubscribe()
    }
  }

  const totalStudents = new Set(students.map(s => s.id)).size
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'Instructor'}! 👨‍🏫
        </h1>
        <p className="text-primary-foreground/80">
          Monitor student progress and manage your courses
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <Progress value={avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseStats.length}</div>
            <p className="text-xs text-muted-foreground">Courses taught</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courseStats.length > 0
                ? Math.round(courseStats.reduce((sum, c) => sum + c.completion_rate, 0) / courseStats.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>
            Overview of student progress across your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseStats.map((course) => (
              <div key={course.course_name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{course.course_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.enrolled_students} students enrolled
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{course.avg_progress}%</div>
                    <div className="text-xs text-muted-foreground">Avg Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">{course.completion_rate}%</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <Progress value={course.avg_progress} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Progress & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Student Progress</CardTitle>
            <CardDescription>
              Latest updates from your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={student.progress === 100 ? "default" : "secondary"}>
                      {student.progress}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(student.last_active).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Student activities and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <Bell className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.profiles?.full_name}</span> {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructor Actions</CardTitle>
          <CardDescription>
            Manage your teaching responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Create Course
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Sessions
            </Button>
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
