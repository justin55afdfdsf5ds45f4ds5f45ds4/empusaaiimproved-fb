"use client"

import { useEffect, useRef, useState } from "react"
import { motion, Variants, Transition } from "framer-motion"
import { Link, FileText, Rocket } from "lucide-react"

interface AnimationVariants {
  icon: Variants;
  background: Variants;
  border: Variants;
  particles?: Variants[];
  trail?: Variants[];
}

const animations: Record<"paste" | "generate" | "publish", AnimationVariants> = {
    paste: {
      icon: {
        hover: {
          scale: [1, 1.2, 0.95, 1.1, 1],
          transition: { duration: 0.6 }
        }
      } as Variants,
      background: {
        initial: { opacity: 0 },
        hover: {
          opacity: [0, 0.25, 0],
          backgroundImage: "radial-gradient(circle at center, rgba(230, 0, 35, 0.8) 0%, rgba(230, 0, 35, 0.4) 35%, rgba(230, 0, 35, 0.1) 70%)",
          transition: { 
            opacity: {
              duration: 2,
              times: [0, 0.1, 1],
              ease: "easeOut"
            },
            default: { duration: 0.3 }
          }
        }
      } as Variants,
      border: {
        initial: {
          opacity: 0,
          pathLength: 0,
          rotate: 0
        },
        hover: {
          opacity: 0.6,
          pathLength: 1,
          rotate: 360,
          transition: {
            pathLength: { duration: 2, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }
        }
      } as Variants,
      particles: Array.from({ length: 20 }).map((_, i: number) => ({
        initial: { opacity: 0, scale: 0 },
        hover: {
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
          x: 50 * Math.cos(i * (360 / 20) * (Math.PI / 180)),
          y: 50 * Math.sin(i * (360 / 20) * (Math.PI / 180)),
          transition: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeOut"
          } as Transition
        }
      })) as Variants[]
    },
    generate: {
      icon: {
        hover: {
          scale: [1, 1.1, 0.9, 1.1, 1],
          filter: [
            'brightness(1)',
            'brightness(1.3) hue-rotate(60deg) saturate(1.5)',
            'brightness(1.5) hue-rotate(-60deg) saturate(2)',
            'brightness(1)'
          ],
          transition: { 
            duration: 3,
            ease: [0.43, 0.13, 0.23, 0.96],
            repeat: Infinity
          }
        }
      } as Variants,
      background: {
        initial: { opacity: 0 },
        hover: {
          opacity: [0, 0.25, 0],
          backgroundImage: "radial-gradient(circle at center, rgba(230, 0, 35, 0.8) 0%, rgba(230, 0, 35, 0.4) 35%, rgba(230, 0, 35, 0.1) 70%)",
          transition: { 
            opacity: {
              duration: 2,
              times: [0, 0.1, 1],
              ease: "easeOut"
            },
            default: { duration: 0.3 }
          }
        }
      } as Variants,
      border: {
        initial: {
          opacity: 0,
          pathLength: 0,
          rotate: 0
        },
        hover: {
          opacity: 0.6,
          pathLength: 1,
          rotate: 360,
          transition: {
            pathLength: { duration: 2, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }
        }
      } as Variants,
      particles: Array.from({ length: 20 }).map((_, i: number) => ({
        initial: { opacity: 0, scale: 0 },
        hover: {
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
          x: 50 * Math.cos(i * (360 / 20) * (Math.PI / 180)),
          y: 50 * Math.sin(i * (360 / 20) * (Math.PI / 180)),
          transition: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeOut"
          } as Transition
        }
      })) as Variants[]
    },
    publish: {
      icon: {
        initial: {
          y: 0,
          rotate: 0,
          scale: 1,
          x: 0
        },
        hover: {
          y: [-400, -400, 400, 0],
          x: [-100, 100, -50, 0],
          rotate: [0, -15, 180, 360],
          scale: [1, 1.5, 1.5, 1],
          transition: {
            duration: 4,
            times: [0, 0.3, 0.7, 1],
            repeat: Infinity,
            ease: [0.43, 0.13, 0.23, 0.96]
          } as Transition
        }
      } as Variants,
      background: {
        initial: { opacity: 0 },
        hover: {
          opacity: [0, 0.25, 0],
          backgroundImage: "radial-gradient(circle at center, rgba(230, 0, 35, 0.8) 0%, rgba(230, 0, 35, 0.4) 35%, rgba(230, 0, 35, 0.1) 70%)",
          transition: { 
            opacity: {
              duration: 2,
              times: [0, 0.1, 1],
              ease: "easeOut"
            },
            default: { duration: 0.3 }
          }
        }
      } as Variants,
      border: {
        initial: {
          opacity: 0,
          pathLength: 0,
          rotate: 0
        },
        hover: {
          opacity: 0.6,
          pathLength: 1,
          rotate: 360,
          transition: {
            pathLength: { duration: 2, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }
        }
      } as Variants,
      particles: Array.from({ length: 20 }).map((_, i: number) => ({
        initial: { opacity: 0, scale: 0 },
        hover: {
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
          x: 50 * Math.cos(i * (360 / 20) * (Math.PI / 180)),
          y: 50 * Math.sin(i * (360 / 20) * (Math.PI / 180)),
          transition: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeOut"
          } as Transition
        }
      })) as Variants[],
      trail: Array.from({ length: 25 }).map((_, i: number) => ({
        initial: { opacity: 0, y: 0, scale: 0 },
        hover: {
          opacity: [0, 0.5, 0.5, 0],
          scale: [0.5, 1, 1, 0.5],
          y: [0, i < 12 ? -300 : 300],
          x: 35 * Math.sin(i * 30),
          transition: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.08,
            times: [0, 0.3, 0.7, 1]
          } as Transition
        }
      })) as Variants[]
    }
  }

const StatsCard = ({ 
  title,
  description,
  icon: Icon,
  delay,
  emoji,
  animationType
}: { 
  title: string
  description: string
  icon: any
  delay: number
  emoji: string
  animationType: "paste" | "generate" | "publish"
}) => {
  const ref = useRef(null)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 min-h-[280px] flex flex-col group"
      data-cursor="automation"
      whileHover="hover"
    >
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        variants={animations[animationType].background}
      />

      {/* Animated border for all boxes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`gradient-${animationType}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E60023">
              <animate
                attributeName="stop-color"
                values="#E60023; #FF4B2B; #E60023"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#FF4B2B">
              <animate
                attributeName="stop-color"
                values="#FF4B2B; #E60023; #FF4B2B"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="16"
          fill="none"
          stroke={`url(#gradient-${animationType})`}
          strokeWidth="1"
          variants={animations[animationType].border}
          style={{
            rotate: "var(--rotate, 0deg)",
            transformOrigin: "center"
          }}
        />
      </svg>

      {/* Background explosion effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        variants={animations[animationType].background}
      >
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </motion.div>

      <div className="flex flex-col items-center text-center h-full relative">
        <div className="mb-6 relative">
          <div className="w-16 h-16 rounded-xl bg-[#E60023]/10 flex items-center justify-center relative overflow-visible">
            <motion.span 
              className="text-2xl relative z-10"
              variants={animations[animationType].icon}
              style={{
                position: ["publish", "paste", "generate"].includes(animationType) ? "absolute" : "relative",
                zIndex: 50
              }}
            >
              {emoji}
            </motion.span>

            {/* Animation-specific particles/effects */}
            {(animationType === "paste" || animationType === "generate" || animationType === "publish") && (
              <div className="absolute inset-0 overflow-visible">
                {(animations[animationType] as AnimationVariants).particles?.map((particle, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#E60023]"
                    variants={particle}
                    style={{
                      rotate: i * (360 / 20)
                    }}
                  />
                ))}
              </div>
            )}

            {animationType === "publish" && animations.publish.trail && (
              <div className="absolute inset-0 overflow-visible">
                {animations.publish.trail.map((trail, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      rotate: i * 30,
                      zIndex: 40
                    }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: i % 2 === 0 ? "#E60023" : "#FF4B2B",
                        filter: `blur(${i % 2 ? '1px' : '0px'})`
                      }}
                      variants={trail}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Title highlight for all boxes */}
          <h3 className="text-xl font-bold text-[#E60023] mb-3 relative">
            {title}
          </h3>
          <p className="text-gray-600 text-base leading-relaxed max-w-[90%] mx-auto">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export const PinterestAutomation = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From URL to Pin,{" "}
            <span className="text-[#E60023]">
              Let AI Handle the Rest.
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empusa AI automatically creates and publishes SEO-optimized Pinterest content from any URL, helping brands and creators save time and boost engagement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <StatsCard
            title="Paste Any URL"
            description="Blog posts, product pages, or articles — just drop your link."
            icon={Link}
            delay={0.2}
            emoji="✍️"
            animationType="paste"
          />
          <StatsCard
            title="AI Writes & Designs Pins"
            description="Titles, descriptions, and visuals — all auto-generated."
            icon={FileText}
            delay={0.4}
            emoji="🧠"
            animationType="generate"
          />
          <StatsCard
            title="Auto-Publish to Pinterest"
            description="Content is scheduled and posted 24/7 to grow your reach."
            icon={Rocket}
            delay={0.6}
            emoji="🚀"
            animationType="publish"
          />
        </div>

        {/* Browser Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white">
            {/* Browser Bar */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-white rounded-md py-1 px-3 text-sm text-gray-600 font-medium">
                  pinterest.com
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * item }}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-white group"
                  data-cursor="pin"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="h-2 w-3/4 bg-gray-200 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-gray-200 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 