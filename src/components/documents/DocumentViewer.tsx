import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

interface DocumentViewerProps {
    docPages: string[];
    isDisabled?: boolean;
    placeholders: Placeholder[];
    onImageClick: (pageIndex: number, e: React.MouseEvent<HTMLImageElement>) => void;
    onUpdatePlaceholder: (id: number, updates: Partial<Placeholder>) => void;
    onDeletePlaceholder: (id: number) => void;
    users: string[]; // Add users prop
    onPlaceholderDrop?: (pageIndex: number, xPercent: number, yPercent: number, type: string) => void;
    selectedPlaceholderType?: string | null;
}

interface Placeholder {
    id: number;
    pageIndex: number;
    xPercent: number;
    yPercent: number;
    widthPercent: number;
    heightPercent: number;
    fieldType?: "name" | "date" | "signature" | "text";
    signer?: string | undefined;
    editingStep?: "fieldType" | "signer";
}

export function DocumentViewer({
    docPages,
    isDisabled,
    placeholders,
    onUpdatePlaceholder,
    onDeletePlaceholder,
    onPlaceholderDrop,
    selectedPlaceholderType
}: DocumentViewerProps) {
    const [, forceUpdate] = useState({});

    // Add this useEffect to handle window resizing
    useEffect(() => {
        const handleResize = () => forceUpdate({});
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleTouchEnd = (e: React.TouchEvent, pageIndex: number) => {
        if (!selectedPlaceholderType) return;

        const touch = e.changedTouches[0];
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const image = target.querySelector('img');
        if (!image) return;

        // Calculate percentages relative to the image
        const xPercent = ((touch.clientX - rect.left) / image.offsetWidth) * 100;
        const yPercent = ((touch.clientY - rect.top) / image.offsetHeight) * 100;

        onPlaceholderDrop?.(pageIndex, xPercent, yPercent, selectedPlaceholderType);
    };
    return (
        <div className="relative overflow-hidden">
            {isDisabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-white text-lg font-semibold z-10">
                    Please fill in the details to view this page
                </div>
            )}

            <div className={`overflow-y-auto max-h-[80vh] border border-gray-600 p-2 custom-scrollbar relative ${isDisabled ? "blur-sm pointer-events-none" : ""}`}>
                {docPages.map((pageUrl, index) => (
                    <div
                        key={index}
                        className="relative inline-block w-full"
                        onTouchEnd={(e) => handleTouchEnd(e, index)}
                    >
                        <img
                            src={pageUrl}
                            alt={`Page ${index + 1}`}
                            className="border border-gray-500 w-full"
                            data-page-index={index}
                        />
                        {placeholders
                            .filter(p => p.pageIndex === index)
                            .map(placeholder => {
                                const parentImage = document.querySelector(`[data-page-index="${index}"]`) as HTMLImageElement;
                                const imageWidth = parentImage?.offsetWidth || 800;
                                const imageHeight = parentImage?.offsetHeight || 1000;

                                const xPixels = (placeholder.xPercent * imageWidth) / 100;
                                const yPixels = (placeholder.yPercent * imageHeight) / 100;
                                const widthPixels = (placeholder.widthPercent * imageWidth) / 100;
                                const heightPixels = (placeholder.heightPercent * imageHeight) / 100;

                                return (
                                    <Rnd
                                        key={placeholder.id}
                                        default={{
                                            x: xPixels,
                                            y: yPixels,
                                            width: widthPixels,
                                            height: heightPixels
                                        }}
                                        position={{
                                            x: xPixels,
                                            y: yPixels
                                        }}
                                        size={{
                                            width: widthPixels,
                                            height: heightPixels
                                        }}
                                        style={{
                                            position: 'absolute',
                                            backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                            border: '2px solid white',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: 'min(1.5vw, 12px)',
                                            zIndex: 1000,
                                            pointerEvents: 'auto',
                                            padding: '6px',
                                            left: 0,
                                            top: 0,
                                            cursor: 'move'
                                        }}
                                        bounds="parent"
                                        enableResizing={{
                                            bottom: true,
                                            right: true,
                                            bottomRight: true
                                        }}
                                        onDragStop={(e, d) => {
                                            const parentImage = (e.target as HTMLElement)
                                                .closest('.relative')
                                                ?.querySelector('img');
                                            if (!parentImage) return;

                                            const xPercent = (d.x / parentImage.offsetWidth) * 100;
                                            const yPercent = (d.y / parentImage.offsetHeight) * 100;

                                            onUpdatePlaceholder(placeholder.id, {
                                                xPercent,
                                                yPercent
                                            });
                                        }}
                                        onResizeStop={(_e, _direction, ref, _delta) => {
                                            const parentImage = ref
                                                .closest('.relative')
                                                ?.querySelector('img');
                                            if (!parentImage) return;

                                            const widthPercent = (ref.offsetWidth / parentImage.offsetWidth) * 100;
                                            const heightPercent = (ref.offsetHeight / parentImage.offsetHeight) * 100;

                                            // Keep the original position (xPercent and yPercent) from the placeholder
                                            onUpdatePlaceholder(placeholder.id, {
                                                widthPercent,
                                                heightPercent
                                            });
                                        }}
                                        resizeHandleStyles={{
                                            bottomRight: {
                                                width: '12px',
                                                height: '12px',
                                                background: 'white',
                                                borderRadius: '50%',
                                                right: '-6px',
                                                bottom: '-6px',
                                                cursor: 'nwse-resize',
                                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                                position: 'absolute',
                                                zIndex: 1001,
                                            }
                                        }}
                                    >
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <button
                                                onClick={() => onDeletePlaceholder(placeholder.id)}
                                                onTouchEnd={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onDeletePlaceholder(placeholder.id);
                                                }}
                                                className="absolute top-[-12px] right-[-12px] w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg touch-manipulation"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <div className="font-bold truncate w-full text-center mb-1">{placeholder.signer}</div>
                                            <div className="text-gray-300 text-[11px]">{placeholder.fieldType}</div>
                                        </div>
                                    </Rnd>
                                )
                            })
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}