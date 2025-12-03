"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, CheckCircle, XCircle, LogOut } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [recruitments, setRecruitments] = useState<any[]>([])

  useEffect(() => {
    // Check session storage for persistence during session
    const auth = sessionStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      loadRecruitments()
    }
  }, [])

  const loadRecruitments = async () => {
    try {
      const supabase = createClient()
      console.log("[v0] Loading recruitments from Supabase...")

      const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error loading recruitments:", error)
        toast.error("Erreur de chargement des candidatures")
        return
      }

      console.log("[v0] Recruitments loaded:", data?.length || 0)
      setRecruitments(data || [])
    } catch (error) {
      console.error("[v0] Fatal error in loadRecruitments:", error)
      toast.error("Erreur de connexion à la base de données")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "LilleInteractiveAnimation" && password === "AdminLilleInteractiveCensure") {
      setIsAuthenticated(true)
      sessionStorage.setItem("adminAuth", "true")
      loadRecruitments()
      toast.success("Connexion réussie")
    } else {
      toast.error("Identifiants incorrects")
      sessionStorage.removeItem("adminAuth")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("adminAuth")
  }

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("applications").update({ status }).eq("id", id)

    if (error) {
      toast.error("Erreur lors de la mise à jour")
    } else {
      setRecruitments(recruitments.map((rec) => (rec.id === id ? { ...rec, status } : rec)))
      toast.success(`Candidature ${status === "accepted" ? "acceptée" : "refusée"}`)
    }
  }

  const deleteRecruitment = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("applications").delete().eq("id", id)

    if (error) {
      toast.error("Erreur lors de la suppression")
    } else {
      setRecruitments(recruitments.filter((rec) => rec.id !== id))
      toast.success("Candidature supprimée")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Administration Lille Interactive</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Accès réservé à l'équipe d'animation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Dashboard Animation
            </h1>
            <p className="text-zinc-400">Gérez les recrutements de Lille Interactive</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-900 text-red-500 hover:bg-red-950 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Candidatures reçues ({recruitments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-zinc-800 text-zinc-400 mb-4">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="accepted">Acceptées</TabsTrigger>
                <TabsTrigger value="rejected">Refusées</TabsTrigger>
              </TabsList>

              {["all", "pending", "accepted", "rejected"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="rounded-md border border-zinc-800">
                    <Table>
                      <TableHeader className="bg-zinc-800/50">
                        <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                          <TableHead className="text-zinc-400">Date</TableHead>
                          <TableHead className="text-zinc-400">Candidat</TableHead>
                          <TableHead className="text-zinc-400">Role</TableHead>
                          <TableHead className="text-zinc-400">Age</TableHead>
                          <TableHead className="text-zinc-400">Discord</TableHead>
                          <TableHead className="text-zinc-400">Motivation</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                          <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recruitments
                          .filter((r) => tab === "all" || r.status === tab)
                          .map((rec) => (
                            <TableRow key={rec.id} className="border-zinc-800 hover:bg-zinc-800/30">
                              <TableCell className="font-mono text-xs text-zinc-500">
                                {new Date(rec.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium text-white">{rec.pseudo_roblox}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    rec.role?.includes("Illégal")
                                      ? "text-red-400 border-red-900 bg-red-950/30"
                                      : rec.role?.includes("Légal")
                                        ? "text-blue-400 border-blue-900 bg-blue-950/30"
                                        : "text-violet-400 border-violet-900 bg-violet-950/30"
                                  }
                                >
                                  {rec.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-zinc-300">{rec.age}</TableCell>
                              <TableCell className="text-zinc-300">{rec.discord_id}</TableCell>
                              <TableCell className="max-w-xs truncate text-zinc-400" title={rec.motivation}>
                                {rec.motivation}
                              </TableCell>
                              <TableCell>
                                {rec.status === "pending" && (
                                  <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">
                                    En attente
                                  </Badge>
                                )}
                                {rec.status === "accepted" && (
                                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">
                                    Accepté
                                  </Badge>
                                )}
                                {rec.status === "rejected" && (
                                  <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20">Refusé</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {rec.status === "pending" && (
                                    <>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-950"
                                        onClick={() => updateStatus(rec.id, "accepted")}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950"
                                        onClick={() => updateStatus(rec.id, "rejected")}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-950/50"
                                    onClick={() => deleteRecruitment(rec.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        {recruitments.filter((r) => tab === "all" || r.status === tab).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-zinc-500">
                              Aucune candidature trouvée
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
