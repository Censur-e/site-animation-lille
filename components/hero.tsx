"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Info, Send, CheckCircle2, Clock, Skull, Gavel, Drama } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GodRays, MeshGradient } from "@paper-design/shaders-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const roles = [
  {
    id: "illegal",
    title: "Animateur Illégal",
    subtitle: "Gangs & Criminalité",
    description: "Supervisez les dossiers criminels, les guerres de gangs et le trafic.",
    longDescription:
      "En tant qu'Animateur Illégal, vous êtes le garant de la cohérence criminelle. Vous gérez les dossiers de gangs, validez les descentes et créez des scénarios de trafic majeurs.",
    color: "#DC2626", // Red
    gradient: ["#EF4444", "#991B1B", "#F87171", "#B91C1C"],
    icon: Skull,
  },
  {
    id: "legal",
    title: "Animateur Légal",
    subtitle: "Entreprises & Civil",
    description: "Animez la vie civile, les entreprises et les événements publics de la ville.",
    longDescription:
      "L'Animateur Légal s'assure que la ville vit. Vous aidez les entreprises à organiser des soirées, gérez les services publics et créez des événements communautaires.",
    color: "#2563EB", // Blue
    gradient: ["#3B82F6", "#1E40AF", "#60A5FA", "#1D4ED8"],
    icon: Gavel,
  },
  {
    id: "scene",
    title: "Animateur de Scènes",
    subtitle: "Acting & PNJ",
    description: "Incarnez des personnages clés pour débloquer des situations ou enrichir le RP.",
    longDescription:
      "Le pôle Scènes est dédié à l'acting pur. Vous n'avez pas de dossier fixe, vous êtes un électron libre envoyé par le staff pour jouer un PNJ spécifique (otage, témoin, VIP).",
    color: "#7C3AED", // Purple
    gradient: ["#8B5CF6", "#4C1D95", "#A78BFA", "#6D28D9"],
    icon: Drama,
  },
  {
    id: "process",
    title: "Processus & Infos",
    subtitle: "Comment nous rejoindre ?",
    description: "Découvrez les étapes du recrutement et la philosophie de notre équipe.",
    longDescription:
      "Nous ne cherchons pas des robots, mais des passionnés. Voici comment se déroule votre intégration au sein du staff Animation.",
    color: "#1F2937", // Gray
    gradient: ["#374151", "#111827", "#4B5563", "#1F2937"],
    icon: Info,
  },
]

export default function Hero() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleExpand = (id: string) => {
    setExpandedId(id)
  }

  const handleClose = () => {
    setExpandedId(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!expandedId) return

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const application = {
      role: roles.find((r) => r.id === expandedId)?.title || expandedId,
      pseudo_roblox: formData.get("pseudoRoblox") as string,
      discord_id: formData.get("discord") as string,
      age: formData.get("age") as string,
      specific_answer: formData.get("specific") as string,
      motivation: formData.get("motivation") as string,
      status: "pending",
    }

    try {
      const { error } = await supabase.from("applications").insert([application])

      if (error) throw error

      toast.success("Candidature envoyée avec succès !", {
        description: "L'équipe Animation étudiera votre profil sous peu.",
      })
      handleClose()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast.error("Erreur lors de l'envoi", {
        description: "Veuillez réessayer plus tard.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (expandedId) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [expandedId])

  const activeRole = roles.find((r) => r.id === expandedId)

  return (
    <>
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="absolute inset-0">
          <GodRays
            colorBack="#00000000"
            colors={["#FFFFFF6E", "#F3F3F3F0", "#8A8A8A", "#989898"]}
            colorBloom="#FFFFFF"
            offsetX={0.85}
            offsetY={-1}
            intensity={1}
            spotty={0.45}
            midSize={10}
            midIntensity={0}
            density={0.12}
            bloom={0.15}
            speed={1}
            scale={1.6}
            frame={3332042.8159981333}
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 text-center max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[90%] tracking-[-0.03em] text-black mix-blend-exclusion max-w-4xl">
            Rejoignez l'équipe Animation de Lille Interactive
          </h1>

          <p className="text-base sm:text-lg md:text-xl leading-[160%] text-black max-w-2xl px-4 mb-8">
            Vous souhaitez contribuer à l'univers du serveur ? L'équipe dirigée par <strong>Censure</strong> recrute des
            animateurs passionnés pour ses différents pôles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
            <AnimatePresence>
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  layoutId={`card-${role.id}`}
                  onClick={() => handleExpand(role.id)}
                  className="relative cursor-pointer overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-black/5 hover:border-black/10 transition-colors group"
                  style={{ aspectRatio: "3/4" }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ backgroundColor: role.color }}
                  />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-xl bg-white/50 backdrop-blur-md">
                        <role.icon className="w-6 h-6" style={{ color: role.color }} />
                      </div>
                    </div>

                    <div className="text-left">
                      <motion.h3 className="text-xl font-bold text-black mb-1">{role.title}</motion.h3>
                      <p className="text-sm text-black/60 font-medium">{role.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expandedId && activeRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              layoutId={`card-${expandedId}`}
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: "24px",
                backgroundColor: activeRole.color,
              }}
              className="relative flex h-full w-full overflow-y-auto transform-gpu will-change-transform max-w-[95%] sm:max-w-[90%] md:max-w-[1200px] max-h-[95vh] sm:max-h-[90vh]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                layout={false}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="absolute h-full inset-0 overflow-hidden pointer-events-none"
                style={{
                  borderRadius: "24px",
                }}
              >
                <MeshGradient
                  speed={1}
                  colors={activeRole.gradient}
                  distortion={0.8}
                  swirl={0.1}
                  grainMixer={0}
                  grainOverlay={0}
                  className="inset-0 sticky top-0"
                  style={{ height: "100%", width: "100%" }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="relative z-10 flex flex-col lg:flex-row h-full w-full items-start p-6 sm:p-10 gap-8 lg:gap-16 overflow-y-auto"
              >
                <motion.button
                  onClick={handleClose}
                  className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center text-white bg-black/20 hover:bg-black/40 transition-colors rounded-full backdrop-blur-md"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </motion.button>

                <div className="flex-1 flex flex-col w-full pt-8 lg:pt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit mb-6">
                    <activeRole.icon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{activeRole.subtitle}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-none tracking-[-0.03em] mb-6">
                    {activeRole.title}
                  </h2>

                  <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8">{activeRole.longDescription}</p>

                  {expandedId === "process" ? (
                    <div className="space-y-6">
                      <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5" /> Étapes du recrutement
                        </h3>
                        <ul className="space-y-4">
                          <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                              1
                            </div>
                            <p className="text-white/80">Envoi du formulaire de candidature via le rôle souhaité.</p>
                          </li>
                          <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                              2
                            </div>
                            <p className="text-white/80">
                              Étude du dossier par le Responsable Animation (délai : 48h).
                            </p>
                          </li>
                          <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                              3
                            </div>
                            <p className="text-white/80">
                              Entretien vocal sur Discord pour discuter de vos motivations.
                            </p>
                          </li>
                          <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                              4
                            </div>
                            <p className="text-white/80">Période d'essai de 2 semaines avec un parrain.</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-bold mb-4">Pourquoi ce rôle ?</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-white/60 shrink-0" />
                          <span>Accès aux commandes d'animation</span>
                        </li>
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-white/60 shrink-0" />
                          <span>Une équipe soudée et une bonne ambiance</span>
                        </li>
                        <li className="flex items-start gap-3 text-white/80 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-white/60 shrink-0" />
                          <span>Possibilité d'évolution vers l'équipe de Modération</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full bg-black/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10">
                  {expandedId === "process" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Prêt à nous rejoindre ?</h3>
                      <p className="text-white/70 max-w-md">
                        Fermez cette fenêtre et sélectionnez le rôle qui vous correspond le mieux (Animateur, Scénariste
                        ou Acteur) pour accéder au formulaire.
                      </p>
                      <button
                        onClick={handleClose}
                        className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors"
                      >
                        Retour aux pôles
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <h3 className="text-xl font-bold text-white mb-2">Candidature : {activeRole.title}</h3>

                      <div>
                        <label className="block text-[10px] font-mono font-normal text-white/70 mb-2 tracking-[0.5px] uppercase">
                          PSEUDO ROBLOX *
                        </label>
                        <input
                          type="text"
                          name="pseudoRoblox"
                          required
                          placeholder="Votre pseudo Roblox"
                          className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-sm h-10"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-normal text-white/70 mb-2 tracking-[0.5px] uppercase">
                          ÂGE *
                        </label>
                        <input
                          type="number"
                          name="age"
                          required
                          min="13"
                          placeholder="Votre âge"
                          className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-sm h-10"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-normal text-white/70 mb-2 tracking-[0.5px] uppercase">
                          DISCORD ID *
                        </label>
                        <input
                          type="text"
                          name="discord"
                          required
                          placeholder="ex: User#1234"
                          className="w-full px-4 py-2.5 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-sm h-10"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-normal text-white/70 mb-2 tracking-[0.5px] uppercase">
                          {expandedId === "illegal"
                            ? "UNE IDÉE D'EVENT ILLEGAL ?"
                            : expandedId === "legal"
                              ? "UNE IDÉE D'EVENT PUBLIC ?"
                              : expandedId === "scene"
                                ? "VOTRE MEILLEURE IDÉE D'EVENT ?"
                                : "VOTRE MEILLEURE IDÉE D'EVENT ?"}{" "}
                          *
                        </label>
                        <textarea
                          rows={3}
                          name="specific"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all resize-none text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-normal text-white/70 mb-2 tracking-[0.5px] uppercase">
                          VOS MOTIVATIONS *
                        </label>
                        <textarea
                          rows={4}
                          name="motivation"
                          required
                          className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all resize-none text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all transform hover:scale-[1.02] tracking-normal h-12 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
