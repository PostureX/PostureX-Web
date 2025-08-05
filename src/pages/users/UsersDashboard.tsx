"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/api/api"
import type { User } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, RefreshCw, UserX, Search, Users, Calendar, Mail, BarChart3, Grid, List } from "lucide-react"
import { formatDate, formatRelativeTime, getInitials, getPercentColor } from "@/utils/Utils"
import { useNavigate } from "react-router"

export default function UsersDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users")
      // Enhance user data with mock stats - replace with actual API calls
      return res.data.users.map((user: User) => ({
        ...user,
        analysisCount: Math.floor(Math.random() * 50) + 1,
        lastAnalysis: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        averageScore: Math.floor(Math.random() * 40) + 60,
      }))
    },
  })

  const filteredUsers = data?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleViewAnalyses = (userId: string) => {
    navigate(`/users/${userId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 flex flex-col items-center gap-4 shadow-lg">
          <div className="animate-spin text-primary">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div className="text-lg font-semibold text-foreground">Loading trainees...</div>
          <div className="text-sm text-muted-foreground">Fetching user data and statistics</div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 flex flex-col items-center gap-4 shadow-lg">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <div className="text-lg font-semibold text-destructive">Failed to load trainees</div>
          <div className="text-sm text-muted-foreground text-center">
            Unable to fetch user data. Please check your connection and try again.
          </div>
          <Button onClick={() => refetch()} className="mt-2 flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/80">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 flex flex-col items-center gap-4 shadow-lg">
          <UserX className="w-12 h-12 text-muted-foreground" />
          <div className="text-lg font-semibold text-foreground">No trainees found</div>
          <div className="text-sm text-muted-foreground text-center">
            There are currently no registered trainees in the system.
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trainees</h1>
            <p className="text-muted-foreground mt-1">View trainee details and their analysis history</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 bg-secondary text-secondary-foreground">
              <Users className="w-4 h-4 mr-2" />
              {data.length} Total Trainees
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card variant="noHighlight">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Grid/List */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              aria-label={view === "grid" ? "Switch to list view" : "Switch to grid view"}
              onClick={() => setView(prev => prev === "grid" ? "list" : "grid")}
              className="p-4 border-none"
            >
              {view === "list" ? <List className="w-16 h-16" /> : <Grid className="w-16 h-16" />}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers?.length || 0} of {data.length} trainees
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers?.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate text-foreground">{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card variant="noHighlight" className="text-center gap-0 p-5 rounded-lg bg-accent text-accent-foreground">
                      <div className="text-2xl font-bold text-info">{user.total_analyses || 0}</div>
                      <div className="text-xs text-info">Analyses</div>
                    </Card>
                    <Card variant="noHighlight" className={"text-center gap-0 p-5 rounded-lg bg-accent " + getPercentColor((user.average_overall_score !== undefined ? user.average_overall_score * 100 : 0), "text")}>
                      <div className="text-2xl font-bold text-success">{user.average_overall_score !== undefined ? user.average_overall_score * 100 : 0}%</div>
                      <div className="text-xs text-success">Avg Score (current week)</div>
                    </Card>
                  </div>

                  {/* User Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Analysis</span>
                      <span className="font-medium text-foreground">
                        {user.latest_analysis_datetime ? formatRelativeTime(user.latest_analysis_datetime) : "Never"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Joined</span>
                      <span className="font-medium text-foreground">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">User ID</span>
                      <span className="font-medium text-foreground">#{user.id}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-border">
                    <Button onClick={() => handleViewAnalyses(user.id)} className="w-full flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/80">
                      <BarChart3 className="w-4 h-4" />
                      View Analyses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredUsers?.map((user) => (
                  <div key={user.id} className="p-6 hover:bg-card/80 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{user.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4" />
                            Joined {formatDate(user.created_at)} • ID #{user.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        {/* Stats */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-info">{user.total_analyses || 0}</div>
                          <div className="text-xs text-info">Analyses</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getPercentColor((user.average_overall_score !== undefined ? user.average_overall_score * 100 : 0), "text")}`}>
                            {(user.average_overall_score !== undefined ? user.average_overall_score * 100 : 0)}%
                          </div>
                          <div className="text-xs text-success">Avg Score (current week)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-foreground">
                            {user.latest_analysis_datetime ? formatRelativeTime(user.latest_analysis_datetime) : "Never"}
                          </div>
                          <div className="text-xs text-muted-foreground">Last Analysis</div>
                        </div>
                        {/* Action Button */}
                        <Button onClick={() => handleViewAnalyses(user.id)} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/80">
                          <BarChart3 className="w-4 h-4" />
                          View Analyses
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredUsers?.length === 0 && searchQuery && (
          <Card>
            <CardContent className="p-12 text-center">
              <UserX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No trainees found</h3>
              <p className="text-muted-foreground mb-4">
                No trainees match your search for "{searchQuery}". Try a different search term.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="bg-card text-card-foreground">
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
