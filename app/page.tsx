"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import styles from "./MessageForm.module.css"
import { sendMessage } from "./actions"
import { motion } from "framer-motion"

export default function MessageForm() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const sparklesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (isButtonClicked) {
      const timer = setTimeout(() => {
        setIsButtonClicked(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isButtonClicked])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (formRef.current) {
        const { left, top, width, height } = formRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width
        const y = (e.clientY - top) / height

        formRef.current.style.setProperty("--mouse-x", `${x}`)
        formRef.current.style.setProperty("--mouse-y", `${y}`)

        // 3D effect
        const rotateY = (x - 0.5) * 10 // -5 to 5 degrees
        const rotateX = (y - 0.5) * -10 // 5 to -5 degrees
        formRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

        // Sparkle effect
        createSparkle(e.clientX - left, e.clientY - top)
      }
    }

    const createSparkle = (x: number, y: number) => {
      if (formRef.current) {
        const sparkle = document.createElement("div")
        sparkle.className = styles.sparkle
        sparkle.style.left = `${x}px`
        sparkle.style.top = `${y}px`
        const size = Math.random() * 20 + 10
        sparkle.style.width = `${size}px`
        sparkle.style.height = `${size}px`
        formRef.current.appendChild(sparkle)

        setTimeout(() => {
          sparkle.style.opacity = "1"
        }, 10)

        setTimeout(() => {
          sparkle.style.opacity = "0"
          setTimeout(() => {
            if (formRef.current && formRef.current.contains(sparkle)) {
              formRef.current.removeChild(sparkle)
            }
          }, 300)
        }, 300)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setErrorMessage(null)
    setIsButtonClicked(true)
    setIsSubmitting(true)

    try {
      const result = await sendMessage(formData)
      if (result.success) {
        setTimeout(() => {
          setShowSuccess(true)
          form.reset()
        }, 2000)
      } else {
        setErrorMessage(result.error || "An unknown error occurred")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formContainer} ref={formRef}>
      <motion.h1
        className={styles.animatedHeading}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Message Form
      </motion.h1>
      <form id="messageForm" onSubmit={handleSubmit} style={{ display: showSuccess ? "none" : "block" }}>
        <input type="text" name="name" placeholder="Your Name" required />
        <textarea name="message" placeholder="Write message here" required />

        <button
          type="submit"
          className={`${styles.button} ${isButtonClicked ? styles.clicked : ""}`}
          disabled={isSubmitting}
        >
          <div className={styles.buttonContent}>
            <span>Send Message</span>
            <span className={styles.buttonIconWrapper}>
              <svg className={styles.buttonIcon} viewBox="0 0 14 15" fill="none" width="14" height="15">
                <path
                  d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <svg
            className={styles.tickIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </form>

      {showSuccess && (
        <div className={styles.card}>
          <button className={styles.dismiss} onClick={() => setShowSuccess(false)}>
            ×
          </button>
          <div className={styles.divImageV}>
            <div className={styles.image}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 7L9.00004 18L3.99994 13" stroke="#000" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className={styles.content}>
            <span className={styles.title}>Success!</span>
            <p className={styles.message}>Your message has been sent successfully.</p>
          </div>
        </div>
      )}
    </div>
  )
}

