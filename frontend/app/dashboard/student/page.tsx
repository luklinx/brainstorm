'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react'

interface CourseProgress {
  id: string
  course_name: string
  progress: number
  last_updated: string
}

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
}

export default function StudentDashboard() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadDashboardData()
      setupRealtimeUpdates()
    }
  }, [profile])

  const loadDashboardData = async () => {
    try {
      // Load course progress
      const { data: progressData } = await supabase
        .from('student_progress')
        .select('id, course_name, progress, last_updated')
        .eq('student_id', profile.id)
        .order('last_updated', { ascending: false })

      if (progressData) {
        setCourses(progressData)
      }

      // Load recent activities
      const { data: activityData } = await supabase
        .from('student_activities')
        .select('id, type, description, timestamp')
        .eq('student_id', profile.id)
        .order('timestamp', { ascending: false })
        .limit(5)

      if (activityData) {
        setActivities(activityData)
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
      .channel('student_progress_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_progress',
          filter: `student_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('Progress update:', payload)
          loadDashboardData() // Reload data on changes
        }
      )
      .subscribe()

    // Subscribe to activity updates
    const activityChannel = supabase
      .channel('student_activity_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_activities',
          filter: `student_id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('New activity:', payload)
          setActivities(prev => [payload.new as Activity, ...prev.slice(0, 4)])
        }
      )
      .subscribe()

    return () => {
      progressChannel.unsubscribe()
      activityChannel.unsubscribe()
    }
  }

  const overallProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)
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
          Welcome back, {profile?.full_name || 'Student'}! 👋
        </h1>
        <p className="text-primary-foreground/80">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter(c => c.progress === 100).length}
            </div>
            <p className="text-xs text-muted-foreground">Finished courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>
              Track your progress in enrolled courses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.length === 0 ? (
              <p className="text-muted-foreground">No courses enrolled yet</p>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{course.course_name}</h4>
                    <Badge variant={course.progress === 100 ? "default" : "secondary"}>
                      {course.progress}%
                    </Badge>
                  </div>
                  <Progress value={course.progress} />
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(course.last_updated).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-muted-foreground">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access your learning resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
            <Button variant="outline">
              <Trophy className="mr-2 h-4 w-4" />
              View Certificates
            </Button>
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
