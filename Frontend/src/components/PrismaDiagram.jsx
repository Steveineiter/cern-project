import { Container, Typography } from "@mui/material"
import { useRef, useEffect } from 'react'

/**
 * Prisma diagram on result page
 * @param {array} prismaData
 * @returns 
 */
const PrismaDiagram = ({ prismaData }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Size of canvas window
    canvas.width = 1800
    canvas.height = 1450

    // Orange horisontal box
    const boxWidth = 1000
    const boxHeight = 30
    const borderRadius = 15

    // Blue vertical box
    const verticalBoxWidth = 30
    const verticalBoxHeights = [300, 900, 150]
    const verticalBorderRadius = 15
    const verticalBoxSpacing = 0

    // Boxes in 'Identification' section
    const identificationLeftWidth = 300
    const identificationLeftHeight = 250
    const identificationLeftPadding = 20

    const identificationRightWidth = 300
    const identificationRightHeight = 80
    const identificationRightPadding = 20

    // Boxes in 'Screening' section
    const screeningLeftOneWidth = 300
    const screeningLeftOneHeight = 80
    const screeningLeftOnePadding = 20

    const screeningRightOneWidth = 300
    const screeningRightOneHeight = 200
    const screeningRightOnePadding = 20

    const screeningLeftTwoWidth = 300
    const screeningLeftTwoHeight = 80
    const screeningLeftTwoPadding = 20

    const screeningLeftThreeWidth = 300
    const screeningLeftThreeHeight = 80
    const screeningLeftThreePadding = 20

    const screeningLeftFourWidth = 300
    const screeningLeftFourHeight = 80
    const screeningLeftFourPadding = 20

    const screeningRightTwoWidth = 300
    const screeningRightTwoHeight = 200
    const screeningRightTwoPadding = 20

    const screeningLeftFiveWidth = 600
    const screeningLeftFiveHeight = 80
    const screeningLeftFivePadding = 20

    const screeningRightThreeWidth = 300
    const screeningRightThreeHeight = 80
    const screeningRightThreePadding = 20

    const screeningLeftSixWidth = 400
    const screeningLeftSixHeight = 80
    const screeningLeftSixPadding = 20

    const screeningRightFourWidth = 300
    const screeningRightFourHeight = 200
    const screeningRightFourPadding = 20

    // Boxes in 'Included' section
    const includedLeftOneWidth = 300
    const includedLeftOneHeight = 80
    const includedLeftOnePadding = 20

    const x = (canvas.width - boxWidth) / 2 - 350
    const y = 0

    const drawRoundedRect = (ctx, x, y, width, height, radius) => {
      ctx.beginPath()

      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)

      ctx.closePath()
      ctx.fill()
    }

    const drawArrow = (ctx, startX, startY, endX, endY, arrowLength = 10, arrowWidth = 5, color = 'black') => {
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.stroke()

      const angle = Math.atan2(endY - startY, endX - startX)

      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - arrowLength * Math.cos(angle - Math.PI / 6), endY - arrowLength * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(endX - arrowLength * Math.cos(angle + Math.PI / 6), endY - arrowLength * Math.sin(angle + Math.PI / 6))
      ctx.lineTo(endX, endY)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    const setupText = (ctx, fontSize = '16px', fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top') => {
      ctx.fillStyle = color
      ctx.font = `${fontSize} ${fontFamily}`
      ctx.textAlign = textAlign
      ctx.textBaseline = textBaseline
    }

    const drawVerticalText = (text, x, y) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }

    ctx.fillStyle = 'rgb(231, 151, 59)'
    drawRoundedRect(ctx, x + 10, y, boxWidth, boxHeight, borderRadius)

    ctx.fillStyle = 'black'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Identification of studies', x + boxWidth / 2, y + boxHeight / 2)

    const verticalBoxX = x - verticalBoxWidth - verticalBoxSpacing
    const verticalBoxY = y + boxHeight + verticalBoxSpacing

    let currentY = verticalBoxY
    const verticalTexts = ['Identification', 'Screening', 'Included']
    verticalBoxHeights.forEach((height, index) => {

      ctx.fillStyle = 'rgb(168, 187, 228)'
      drawRoundedRect(ctx, verticalBoxX, currentY, verticalBoxWidth, height, verticalBorderRadius)

      ctx.fillStyle = 'black'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      drawVerticalText(verticalTexts[index], verticalBoxX + verticalBoxWidth / 2, currentY + height / 2)
      currentY += height + verticalBoxSpacing + 20
    })

    const identificationLeftX = x - verticalBoxWidth - verticalBoxSpacing + 50
    const identificationLeftY = y + boxHeight + verticalBoxSpacing + 10

    const identificationRightX = x + verticalBoxWidth - verticalBoxSpacing + 670
    const identificationRightY = y + boxHeight + verticalBoxSpacing + 10

    ctx.strokeRect(identificationLeftX, identificationLeftY, identificationLeftWidth, identificationLeftHeight)

    setupText(ctx)

    const identificationLeftText = [
      'Records identified on (DATE) from:',
      '• MEDLINE (n= -1)',
      '• Scopus (n= -1)',
      '• Sciencedirect (n= -1)',
      '• PROSPERO (n= -1)',
      '• TOTAL (n= -1)',
      '',
      'New records identified on (DATE)',
      '• Total (n= -1)',
    ]

    let lineHeight = 24
    identificationLeftText.forEach((line, index) => {
      ctx.fillText(line, identificationLeftX + identificationLeftPadding, identificationLeftY + identificationLeftPadding + index * lineHeight)
    })

    ctx.strokeRect(identificationRightX, identificationRightY, identificationRightWidth, identificationRightHeight)
    setupText(ctx)

    const identificationRightText = [
      'Records removed before screening',
      '• Duplicate records removed (n= -1)'
    ]
    identificationRightText.forEach((line, index) => {
      ctx.fillText(line, identificationRightX + identificationRightPadding, identificationRightY + identificationRightPadding + index * lineHeight)
    })

    drawArrow(ctx, identificationLeftX + identificationLeftWidth, identificationLeftY + identificationLeftHeight / 2 - 80, identificationRightX, identificationRightY + identificationRightHeight / 2)

    const screeningLeftOneX = verticalBoxX + verticalBoxWidth + verticalBoxSpacing + 20
    const screeningLeftOneY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 70

    ctx.strokeRect(screeningLeftOneX, screeningLeftOneY, screeningLeftOneWidth, screeningLeftOneHeight)
    setupText(ctx)

    const screeningLeftOneText = [
      `Records screened by AI (n=${prismaData[0].value})`
    ]
    screeningLeftOneText.forEach((line, index) => {
      ctx.fillText(line, screeningLeftOneX + screeningLeftOnePadding, screeningLeftOneY + screeningLeftOnePadding + index * lineHeight)
    })

    drawArrow(ctx, identificationLeftX + identificationLeftWidth / 2, identificationLeftY + identificationLeftHeight, screeningLeftOneX + identificationLeftWidth / 2, screeningLeftOneY)

    const screeningRightOneX = identificationRightX
    const screeningRightOneY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 70

    ctx.strokeRect(screeningRightOneX, screeningRightOneY, screeningRightOneWidth, screeningRightOneHeight)
    setupText(ctx)

    const screeningRightOneText = [
      'Records screened by AI:',
      '• Wrong population(n= -1)',
      '• Wrong intervention(n= -1)',
      '• Wrong comparison group(n= -1)',
      '• Wrong outcome(n= -1)',
      '• Wrong study design(n= -1)',
      `• Total (n=${prismaData[1].value})`,
    ]

    screeningRightOneText.forEach((line, index) => {
      ctx.fillText(line, screeningRightOneX + screeningRightOnePadding, screeningRightOneY + screeningRightOnePadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftOneX + screeningLeftOneWidth, screeningLeftOneY + screeningLeftOneHeight / 2, screeningRightOneX, screeningRightOneY + 35)

    const screeningLeftTwoX = verticalBoxX + verticalBoxWidth + verticalBoxSpacing + 150
    const screeningLeftTwoY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 300

    ctx.strokeRect(screeningLeftTwoX, screeningLeftTwoY, screeningLeftTwoWidth, screeningLeftTwoHeight)
    setupText(ctx)

    const screeningLeftTwoText = [
      `Records requiring manual screening`,
      `(n=${prismaData[2].value})`
    ]
    screeningLeftTwoText.forEach((line, index) => {
      ctx.fillText(line, screeningLeftTwoX + screeningLeftTwoPadding, screeningLeftTwoY + screeningLeftTwoPadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftOneX + screeningLeftOneWidth / 2 + 50, screeningLeftOneY + screeningLeftOneHeight, screeningLeftTwoX + screeningLeftTwoWidth / 2 - 80, screeningLeftTwoY)

    const screeningLeftThreeX = verticalBoxX + verticalBoxWidth + verticalBoxSpacing + 20
    const screeningLeftThreeY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 450

    ctx.strokeRect(screeningLeftThreeX, screeningLeftThreeY, screeningLeftThreeWidth, screeningLeftThreeHeight)
    setupText(ctx)

    const screeningLeftThreeText = [
      `Reports assessed for eligibility by AI`,
      `(n=${prismaData[3].value})`
    ]
    screeningLeftThreeText.forEach((line, index) => {
      ctx.fillText(line, screeningLeftThreeX + screeningLeftThreePadding, screeningLeftThreeY + screeningLeftThreePadding + index * lineHeight)
    })

    const screeningLeftFourX = verticalBoxX + verticalBoxWidth + verticalBoxSpacing + 350
    const screeningLeftFourY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 450

    ctx.strokeRect(screeningLeftFourX, screeningLeftFourY, screeningLeftFourWidth, screeningLeftFourHeight)
    setupText(ctx)
    const screeningLeftFourText = [
      `Reports assessed for eligibility by`,
      `human screener (n=${prismaData[4].value})`
    ]
    screeningLeftFourText.forEach((line, index) => {
      ctx.fillText(line, screeningLeftFourX + screeningLeftFourPadding, screeningLeftFourY + screeningLeftFourPadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftOneX + screeningLeftOneWidth / 2 - 70, screeningLeftOneY + screeningLeftOneHeight, screeningLeftThreeX + 80, screeningLeftThreeY)

    drawArrow(ctx, screeningLeftTwoX + screeningLeftTwoWidth / 2 + 90, screeningLeftTwoY + screeningLeftTwoHeight, screeningLeftFourX + 40, screeningLeftFourY)


    const screeningRightTwoX = identificationRightX
    const screeningRightTwoY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 300

    ctx.strokeRect(screeningRightTwoX, screeningRightTwoY, screeningRightTwoWidth, screeningRightTwoHeight)
    setupText(ctx)

    const screeningRightTwoText = [
      'Records excluded by human screener:',
      `• ${prismaData[5].human_exclusion_prisma_values[0].label} (n=${prismaData[5].human_exclusion_prisma_values[0].value})`,
      `• ${prismaData[5].human_exclusion_prisma_values[1].label} (n=${prismaData[5].human_exclusion_prisma_values[1].value})`,
      `• ${prismaData[5].human_exclusion_prisma_values[2].label} (n=${prismaData[5].human_exclusion_prisma_values[2].value})`,
      `• ${prismaData[5].human_exclusion_prisma_values[3].label} (n=${prismaData[5].human_exclusion_prisma_values[3].value})`,
      `• ${prismaData[5].human_exclusion_prisma_values[4].label} (n=${prismaData[5].human_exclusion_prisma_values[4].value})`,
      `• ${prismaData[5].human_exclusion_prisma_values[5].label} (n=${prismaData[5].human_exclusion_prisma_values[5].value})`
    ]
    screeningRightTwoText.forEach((line, index) => {
      ctx.fillText(line, screeningRightTwoX + screeningRightTwoPadding, screeningRightTwoY + screeningRightTwoPadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftTwoX + screeningLeftTwoWidth, screeningLeftTwoY + screeningLeftTwoHeight / 2, screeningRightTwoX, screeningRightTwoY + 35)

    const screeningLeftFiveX = verticalBoxX + verticalBoxWidth + verticalBoxSpacing + 20
    const screeningLeftFiveY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 600

    ctx.strokeRect(screeningLeftFiveX, screeningLeftFiveY, screeningLeftFiveWidth, screeningLeftFiveHeight)
    setupText(ctx)

    const screeningLeftFiveText = [
      `Reports sought for retrieval (n=${prismaData[6].value})`
    ]
    screeningLeftFiveText.forEach((line, index) => {
      ctx.fillText(line, screeningLeftFiveX + screeningLeftFivePadding, screeningLeftFiveY + screeningLeftFivePadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftThreeX + screeningLeftThreeWidth / 2, screeningLeftThreeY + screeningLeftThreeHeight, screeningLeftFiveX + 150, screeningLeftFiveY)

    drawArrow(ctx, screeningLeftFourX + screeningLeftFourWidth / 2, screeningLeftFourY + screeningLeftFourHeight, screeningLeftFiveX + screeningLeftFiveWidth - 120, screeningLeftFiveY)

    const screeningRightThreeX = identificationRightX
    const screeningRightThreeY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 600

    ctx.strokeRect(screeningRightThreeX, screeningRightThreeY, screeningRightThreeWidth, screeningRightThreeHeight)
    setupText(ctx)

    const screeningRightThreeText = [
      'Report not retrieved(n= -1)'
    ]
    screeningRightThreeText.forEach((line, index) => {
      ctx.fillText(line, screeningRightThreeX + screeningRightThreePadding, screeningRightThreeY + screeningRightThreePadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftFiveX + screeningLeftFiveWidth, screeningLeftFiveY + screeningLeftFiveHeight / 2, screeningRightThreeX, screeningRightThreeY + screeningRightThreeHeight / 2)

    const screeningLeftSixX = verticalBoxX + verticalBoxWidth + verticalBoxSpacing + 20
    const screeningLeftSixY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 730

    ctx.strokeRect(screeningLeftSixX, screeningLeftSixY, screeningLeftSixWidth, screeningLeftSixHeight)
    setupText(ctx)

    const screeningLeftSixText = [
      `Reports assessed for eligibility (n= -1)`
    ]
    screeningLeftSixText.forEach((line, index) => {
      ctx.fillText(line, screeningLeftSixX + screeningLeftSixPadding, screeningLeftSixY + screeningLeftSixPadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftFiveX + screeningLeftFiveWidth / 2, screeningLeftFiveY + screeningLeftFiveHeight, screeningLeftSixX + screeningLeftSixWidth - 100, screeningLeftSixY)

    const screeningRightFourX = identificationRightX
    const screeningRightFourY = identificationLeftY + identificationLeftHeight + verticalBoxSpacing + 720

    ctx.strokeRect(screeningRightFourX, screeningRightFourY, screeningRightFourWidth, screeningRightFourHeight)
    setupText(ctx)

    const screeningRightFourText = [
      'Reports excluded by human screener:',
      `• Wrong population(n= -1)`,
      `• Wrong intervention(n= -1)`,
      `• Wrong comparison group(n= -1)`,
      `• Wrong outcome(n= -1)`,
      `• Wrong study design(n= -1)`,
    ]

    screeningRightFourText.forEach((line, index) => {
      ctx.fillText(line, screeningRightFourX + screeningRightFourPadding, screeningRightFourY + screeningRightFourPadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftSixX + screeningLeftSixWidth, screeningLeftSixY + screeningLeftSixHeight / 2, screeningRightFourX, screeningRightFourY + 50)

    const includedLeftOneX = screeningLeftSixX
    const includedLeftOneY = screeningLeftSixY + 260

    ctx.strokeRect(includedLeftOneX, includedLeftOneY, includedLeftOneWidth, includedLeftOneHeight)

    const includedLeftOneText = [
      `Studies included in review: (n= -1)`,
      `Reports of included studies: (n= -1)`
    ]
    includedLeftOneText.forEach((line, index) => {
      ctx.fillText(line, includedLeftOneX + includedLeftOnePadding, includedLeftOneY + includedLeftOnePadding + index * lineHeight)
    })

    drawArrow(ctx, screeningLeftSixX + screeningLeftSixWidth / 2, screeningLeftSixY + screeningLeftSixHeight, includedLeftOneX + includedLeftOneWidth / 2 + 50, includedLeftOneY)
  }, [])

  return (
    <Container>
      <Typography variant='h5' gutterBottom sx={{ fontWeight: 500, margin: '10px 0', textAlign: 'justify' }}>PRISMA Diagram:</Typography>
      <canvas ref={canvasRef} />
    </Container>
  )
}

export default PrismaDiagram
