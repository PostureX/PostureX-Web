"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  originalVx: number
  originalVy: number
  connections: number[]
}

export default function AnimatedNetworkBackground() {
  const NODE_DENSITY_DIVISOR = 10000 // Lower = more nodes
  const NODE_VELOCITY_RANGE = 0.3 // Max initial velocity component
  const REPEL_RADIUS = 100 // Mouse repelling effect radius
  const REPEL_STRENGTH = 5 // Mouse repelling force multiplier
  const CONNECTION_MAX_DISTANCE = 180 // Max distance for node connections
  const CONNECTION_MIN_OPACITY = 0.03
  const CONNECTION_MAX_OPACITY = 0.3
  const MOUSE_VISUAL_RADIUS = REPEL_RADIUS // Visual feedback circle
  const NODE_BASE_OPACITY = 0.6
  const NODE_BASE_SIZE = 2
  const NODE_BASE_GLOW_OPACITY = 0.15
  const NODE_BASE_GLOW_SIZE = 6
  const NODE_HIGHLIGHT_RADIUS = 200 // Distance for node highlight near mouse

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const nodesRef = useRef<Node[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }

    const createNodes = () => {
      const nodeCount = Math.floor((canvas.width * canvas.height) / NODE_DENSITY_DIVISOR)
      const nodes: Node[] = []

      for (let i = 0; i < nodeCount; i++) {
        const vx = (Math.random() - 0.5) * NODE_VELOCITY_RANGE
        const vy = (Math.random() - 0.5) * NODE_VELOCITY_RANGE
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: vx,
          vy: vy,
          originalVx: vx,
          originalVy: vy,
          connections: [],
        })
      }

      nodesRef.current = nodes
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        isActive: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update node positions with mouse repelling effect
      nodesRef.current.forEach((node) => {
        // Reset velocity to original values
        node.vx = node.originalVx
        node.vy = node.originalVy

        // Apply mouse repelling force
        if (mouseRef.current.isActive) {
          const mouseDistance = Math.sqrt(
            Math.pow(node.x - mouseRef.current.x, 2) + Math.pow(node.y - mouseRef.current.y, 2),
          )

          if (mouseDistance < REPEL_RADIUS && mouseDistance > 0) {
            // Calculate repelling force (stronger when closer)
            const force = (REPEL_RADIUS - mouseDistance) / REPEL_RADIUS
            const angle = Math.atan2(node.y - mouseRef.current.y, node.x - mouseRef.current.x)

            // Apply repelling force
            node.vx += Math.cos(angle) * force * REPEL_STRENGTH
            node.vy += Math.sin(angle) * force * REPEL_STRENGTH
          }
        }

        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) {
          node.vx *= -1
          node.originalVx *= -1
        }
        if (node.y <= 0 || node.y >= canvas.height) {
          node.vy *= -1
          node.originalVy *= -1
        }

        // Keep nodes within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))
      })

      // Draw dynamic connections based on current distances
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
      ctx.lineWidth = 1

      nodesRef.current.forEach((node, i) => {
        nodesRef.current.forEach((otherNode, j) => {
          if (i < j) {
            const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2))

            if (distance < CONNECTION_MAX_DISTANCE) {
              const opacity = Math.max(
                CONNECTION_MIN_OPACITY,
                ((CONNECTION_MAX_DISTANCE - distance) / CONNECTION_MAX_DISTANCE) * CONNECTION_MAX_OPACITY,
              )
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`

              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.stroke()
            }
          }
        })
      })

      // Draw mouse influence area (optional visual feedback)
      if (mouseRef.current.isActive) {
        ctx.save()
        ctx.globalAlpha = 0.8
        ctx.filter = "blur(64px)"
        ctx.beginPath()
        ctx.arc(mouseRef.current.x, mouseRef.current.y, MOUSE_VISUAL_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)"
        ctx.fill()
        ctx.restore()
      }

      // Draw nodes with enhanced effect near mouse
      nodesRef.current.forEach((node) => {
        let nodeOpacity = NODE_BASE_OPACITY
        let glowOpacity = NODE_BASE_GLOW_OPACITY
        let nodeSize = NODE_BASE_SIZE
        let glowSize = NODE_BASE_GLOW_SIZE

        // Enhance nodes near mouse
        if (mouseRef.current.isActive) {
          const mouseDistance = Math.sqrt(
            Math.pow(node.x - mouseRef.current.x, 2) + Math.pow(node.y - mouseRef.current.y, 2),
          )
          if (mouseDistance < NODE_HIGHLIGHT_RADIUS) {
            const proximity = (NODE_HIGHLIGHT_RADIUS - mouseDistance) / NODE_HIGHLIGHT_RADIUS
            nodeOpacity = Math.min(1, NODE_BASE_OPACITY + proximity * 0.4)
            glowOpacity = Math.min(0.4, NODE_BASE_GLOW_OPACITY + proximity * 0.25)
            nodeSize = NODE_BASE_SIZE + proximity * 1
            glowSize = 4 + proximity * 3
          }
        }

        // Main node
        ctx.fillStyle = `rgba(59, 130, 246, ${nodeOpacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.fillStyle = `rgba(59, 130, 246, ${glowOpacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createNodes()
    animate()

    // Add mouse event listeners
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    const handleResize = () => {
      resizeCanvas()
      createNodes()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
}
