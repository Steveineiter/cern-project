import React, { useState, useEffect } from 'react'
import './Progressbar.css'
import { Typography, Box } from '@mui/material'

/**
 * Showing progress bar in manual and LLM screening review steps
 * @param {number} progress
 * @param {string} reminingTime
 * @param {number} screenedDocuments
 * @param {string} manualvsLLM
 * @returns 
 */
export default function Progressbar({ progress, reminingTime, screenedDocuments, manualvsLLM }) {
  let height = ''
  let width = ''
  let progressString = ''

  if (manualvsLLM === 'llm') {
    height = '35px'
    width = '590px'
    progressString = `${progress}%`
  } else if (manualvsLLM === 'manual') {
    height = '25px'
    width = '100%'
    progressString = `Document ${progress}`
    progress = progress.match(/^\d+/)[0]
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' width='100%' >
      <div className="progressbar" style={{ height: height, width: width }}>
        <Box sx={{ height: "100%", width: `${progress}%`, backgroundColor: "#3399ff", transition: "width 0.5s" }}>
          <span className="progressPercent">{progressString}</span>
        </Box>
      </div>
      {(manualvsLLM === 'llm') && (
        <>
          <Typography variant='h6' sx={{ mb: 2 }}>Remaining time: {reminingTime} </Typography>
          <Typography variant='h6' sx={{ mb: 2 }}>Screened documents: {screenedDocuments} </Typography>
        </>
      )}
    </Box>
  )
}