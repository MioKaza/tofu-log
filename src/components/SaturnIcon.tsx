import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';

interface SaturnIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function SaturnIcon({ 
  size = 56, 
  color = '#e8e8e8',
  backgroundColor = '#3DB6B1'
}: SaturnIconProps) {
  const iconSize = size * 0.5; // Saturn icon is 50% of circle size
  const iconOffset = (size - iconSize) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Teal circle background */}
      <Circle 
        cx={size / 2} 
        cy={size / 2} 
        r={size / 2} 
        fill={backgroundColor}
      />
      
      {/* Saturn icon centered */}
      <G transform={`translate(${iconOffset}, ${iconOffset})`}>
        <G
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <Circle cx={iconSize / 2} cy={iconSize / 2} r={iconSize * 0.29} />
          <Path
            d={`M ${iconSize * 0.75} ${iconSize * 0.33}c${iconSize * 0.108} -${iconSize * 0.005} ${iconSize * 0.183} ${iconSize * 0.011} ${iconSize * 0.193} ${iconSize * 0.05}c${iconSize * 0.018} ${iconSize * 0.067} -${iconSize * 0.166} ${iconSize * 0.174} -${iconSize * 0.411} ${iconSize * 0.24}c-${iconSize * 0.245} ${iconSize * 0.066} -${iconSize * 0.457} ${iconSize * 0.065} -${iconSize * 0.475} -${iconSize * 0.002}c-${iconSize * 0.011} -${iconSize * 0.04} ${iconSize * 0.05} -${iconSize * 0.093} ${iconSize * 0.151} -${iconSize * 0.144}`}
          />
        </G>
      </G>
    </Svg>
  );
}
