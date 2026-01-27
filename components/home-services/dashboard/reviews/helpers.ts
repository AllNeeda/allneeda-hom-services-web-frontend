import React from 'react'

export const capitalizeTag = (tag?: string | null) => {
    if (!tag) return ''
    return tag.split(' ').map(word =>
        (word.charAt(0) || '').toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

export type Review = any

export default {} as unknown as React.FC
