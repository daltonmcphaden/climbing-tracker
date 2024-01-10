import { Place } from "@mui/icons-material"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef, KeepScale } from "react-zoom-pan-pinch"
import { PinCoordinate } from "../models"
import styled from "@emotion/styled"

interface Props {
  pinLocation: PinCoordinate | undefined
  handleSetPinLocation: (location: PinCoordinate) => void
}

export const GymMap = (props: Props) => {
  const src = "/images/allez-up-psc.jpg"
  const alt = "example"
  const backgroundColor = "white"
  const scaleUp = true
  const zoomFactor = 8

  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [containerHeight, setContainerHeight] = useState<number>(0)

  const [imageNaturalWidth, setImageNaturalWidth] = useState<number>(0)
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number>(0)

  const handleImageClick = (ref: ReactZoomPanPinchRef, event: MouseEvent | TouchEvent) => {
    const mouseEvent = event as MouseEvent
    const imgElement = event.target as HTMLImageElement
    const rect = imgElement?.getBoundingClientRect()
    const x = mouseEvent.clientX - rect.left //x position within the element.
    const y = mouseEvent.clientY - rect.top //y position within the element.
    const width = rect.width
    const height = rect.height

    const xPercentage = ((x / width) * 100).toFixed(2)
    const yPercentage = ((y / height) * 100).toFixed(2)
    const pinLocation: PinCoordinate = { x: Number(xPercentage) / 100, y: Number(yPercentage) / 100 }
    props.handleSetPinLocation(pinLocation)

    console.log(`Clicked at ${xPercentage}% along the width, ${yPercentage}% along the height`)
  }

  const imageScale = useMemo(() => {
    if (containerWidth === 0 || containerHeight === 0 || imageNaturalWidth === 0 || imageNaturalHeight === 0) return 0
    const scale = Math.min(containerWidth / imageNaturalWidth, containerHeight / imageNaturalHeight)
    return scaleUp ? scale : Math.max(scale, 1)
  }, [scaleUp, containerWidth, containerHeight, imageNaturalWidth, imageNaturalHeight])

  const handleResize = useCallback(() => {
    if (container !== null) {
      const rect = container.getBoundingClientRect()
      setContainerWidth(rect.width)
      setContainerHeight(rect.height)
    } else {
      setContainerWidth(0)
      setContainerHeight(0)
    }
  }, [container])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [handleResize])

  const handleImageOnLoad = (image: HTMLImageElement) => {
    setImageNaturalWidth(image.naturalWidth)
    setImageNaturalHeight(image.naturalHeight)
  }

  useEffect(() => {
    const image = new Image()
    image.onload = () => handleImageOnLoad(image)
    image.src = src
  }, [src])

  return (
    <ResponsiveDiv>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
        }}
        ref={(el: HTMLDivElement | null) => setContainer(el)}
      >
        {imageScale > 0 && (
          <TransformWrapper
            key={`${containerWidth}x${containerHeight}`}
            initialScale={imageScale}
            minScale={imageScale}
            maxScale={imageScale * zoomFactor}
            onPanningStop={handleImageClick}
            centerOnInit
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              {props.pinLocation &&
                [props.pinLocation].map((p, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      top: `${50 + (p.y * 100 - 50)}%`,
                      left: `${50 + (p.x * 100 - 50)}%`,
                      transform: `translate(-50%, -50%)`,
                      zIndex: 2,
                    }}
                  >
                    <KeepScale>
                      <Place color={"secondary"} style={{ width: "40px", height: "40px" }} />
                    </KeepScale>
                  </div>
                ))}
              <img alt={alt} src={src} />
            </TransformComponent>
          </TransformWrapper>
        )}
      </div>
    </ResponsiveDiv>
  )
}

const ResponsiveDiv = styled.div`
  height: 400px;

  @media (max-width: 600px) {
    height: 200px;
  }
`
