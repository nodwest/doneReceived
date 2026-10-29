import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Пакет с галочкой: желание, которое уже можно купить. */
export const BagCheckIcon = ({ color = '#000', size = 22 }) => (
  <Svg viewBox="0 0 22 22" width={size} height={size} fill="none">
    <Path
      d="M4.58333 7.33333H17.4167L16.5 18.3333C16.4772 18.5602 16.3706 18.7705 16.2011 18.923C16.0316 19.0756 15.8114 19.1595 15.5833 19.1583H6.41667C6.18863 19.1595 5.96836 19.0756 5.79886 18.923C5.62935 18.7705 5.5228 18.5602 5.5 18.3333L4.58333 7.33333Z"
      stroke={color}
      strokeWidth={1.65}
      strokeLinejoin="round"
    />
    <Path
      d="M8.25 7.33333V5.95833C8.25 5.22899 8.53973 4.52951 9.05546 4.01379C9.57118 3.49806 10.2707 3.20833 11 3.20833C11.7293 3.20833 12.4288 3.49806 12.9445 4.01379C13.4603 4.52951 13.75 5.22899 13.75 5.95833V7.33333"
      stroke={color}
      strokeWidth={1.65}
      strokeLinecap="round"
    />
    <Path
      d="M8.43333 13.0167L10.2667 14.85L13.75 11.3667"
      stroke={color}
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
