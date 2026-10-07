'use client'

import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"
import { useDeferredValue, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

type SearchIconGridProps = {
    query: string
    selectedIcon: IconName | null
    className?: string
    onSelect?: (iconName: IconName) => void
}

const MAX_RESULTS = 48
const INITIAL_ICON_COUNT = 96
const ICON_BATCH_SIZE = 96

function LazyIcon({ name }: { name: IconName }) {
    const iconRef = useRef<HTMLSpanElement>(null)
    const [isNearViewport, setIsNearViewport] = useState(false)

    useEffect(() => {
        const element = iconRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsNearViewport(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "100px" },
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return (
        <span ref={iconRef} className="flex size-5 items-center justify-center">
            {isNearViewport && <DynamicIcon name={name} className="size-5" aria-hidden="true" />}
        </span>
    )
}

function fuzzyScore(name: string, query: string): number {
    const nameWords = name.split("-")
    const queryWords = query.split(" ")
    let score = 0

    for (const queryWord of queryWords) {
        if (name === queryWord) score += 1000
        else if (name.startsWith(queryWord)) score += 500
        else if (nameWords.some((word) => word.startsWith(queryWord))) score += 300
        else if (name.includes(queryWord)) score += 150
        else {
            let queryIndex = 0
            for (const character of name) {
                if (character === queryWord[queryIndex]) queryIndex += 1
                if (queryIndex === queryWord.length) break
            }
            if (queryIndex === queryWord.length) score += 50
            else return 0
        }
    }

    return score - name.length / 100
}

export default function SearchIconGrid({ query, className, selectedIcon, onSelect }: SearchIconGridProps) {
    const deferredQuery = useDeferredValue(query)
    const loadMoreRef = useRef<HTMLDivElement>(null)
    const [iconCount, setIconCount] = useState(INITIAL_ICON_COUNT)
    const normalizedQuery = deferredQuery.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ")

    const matchingIcons = normalizedQuery
        ? iconNames
            .map((name) => ({ name, score: fuzzyScore(name, normalizedQuery) }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
            .slice(0, MAX_RESULTS)
        : []

    const iconsToRender = normalizedQuery
        ? matchingIcons
        : iconNames.slice(0, iconCount).map((name) => ({ name, score: 0 }))

    useEffect(() => {
        if (normalizedQuery || iconCount >= iconNames.length) return

        const element = loadMoreRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIconCount((count) => Math.min(count + ICON_BATCH_SIZE, iconNames.length))
                }
            },
            { rootMargin: "400px" },
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [iconCount, normalizedQuery])

    return (
        <div className={cn("grid grid-cols-6 gap-1", className)}>
            {iconsToRender.map(({ name }) => (
                <Button
                    key={name}
                    type="button"
                    variant={selectedIcon === name ? "outline" : "ghost"}
                    size="icon"
                    aria-label={`Use ${name} icon`}
                    className={`hover:bg-input! ${selectedIcon === name ? "bg-input!" : ""}`}
                    onClick={() => onSelect?.(name)}
                >
                    <LazyIcon name={name} />
                </Button>
            ))}
            {!normalizedQuery && iconCount < iconNames.length && (
                <div ref={loadMoreRef} className="col-span-6 h-1" aria-hidden="true" />
            )}
        </div>
    )
}
