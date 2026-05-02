// // src/components/icons/NotificationIcon.jsx
// import React from 'react';

// export default function NotificationIcon({
//   size = 40,
//   stroke = '#5C6B3C',
//   strokeWidth = 4,
//   badgeColor = '#FF6347',
//   showBadge = false,          
// }) {
//   const m = strokeWidth;
//   const g = 8;
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 40 40"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d={`M${m} ${m} H${40 - m - g}`}
//         stroke={stroke}
//         strokeWidth={strokeWidth}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d={`M${40 - m} ${m + g} V${40 - m}`}
//         stroke={stroke}
//         strokeWidth={strokeWidth}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d={`
//           M${40 - m} ${40 - m}
//           H${m}
//           V${m}
//         `}
//         stroke={stroke}
//         strokeWidth={strokeWidth}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       {showBadge && (
//         <circle
//           cx={40 - m}
//           cy={m}
//           r={g / 2}
//           fill={badgeColor}
//         />
//       )}
//     </svg>
//   );
// }

// // src/components/icons/NotificationIcon.jsx
// import React from 'react';

// export default function NotificationIcon({
//   size = 40,             // total width & height of the SVG
//   stroke = '#5C6B3C',    // frame color
//   strokeWidth = 4,       // thickness of the frame
//   cornerRadius = 8,      // how round each corner should be
//   badgeRadius = 6,       // radius of the notification dot
//   badgeColor = '#FF6347',// color of the dot
//   showBadge = false,     // when true, draws the badge
// }) {
//   // inset so strokes sit cleanly inside viewBox
//   const x0 = strokeWidth / 2;
//   const y0 = strokeWidth / 2;
//   const x1 = size - strokeWidth / 2;
//   const y1 = size - strokeWidth / 2;
//   const r = cornerRadius;

//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox={`0 0 ${size} ${size}`}
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       {/* 
//         One continuous path:
//         - start just right of top-left corner
//         - arc down to round top-left
//         - line down left side
//         - arc bottom-left
//         - line across bottom
//         - arc bottom-right
//         - line up right side (stopping before top-right)
//       */}
//       <path
//         d={`
//           M ${x0 + r} ${y0}
//           A ${r} ${r} 0 0 1 ${x0} ${y0 + r}
//           L ${x0} ${y1 - r}
//           A ${r} ${r} 0 0 1 ${x0 + r} ${y1}
//           L ${x1 - r} ${y1}
//           A ${r} ${r} 0 0 1 ${x1} ${y1 - r}
//           L ${x1} ${y0 + r}
//         `}
//         stroke={stroke}
//         strokeWidth={strokeWidth}
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />

//       {showBadge && (
//         <circle
//           cx={x1}
//           cy={y0}
//           r={badgeRadius}
//           fill={badgeColor}
//         />
//       )}
//     </svg>
//   );
// }



// src/components/icons/NotificationIcon.jsx
import React from 'react';

// Use your provided assets (relative to this file)
import IconOff from '../../images/icons/Notification Icon Off.svg';
import IconOn  from '../../images/icons/Notification Icon On.svg';

/**
 * Minimal, reusable icon wrapper for your notification bell.
 * - `on`     => chooses between On/Off SVGs (purely visual, no logic changed)
 * - `size`   => strict pixel size for exact placement
 * - `className`/`style` passthrough to match existing layouts
 */
export default function NotificationIcon({
  on = false,
  size = 28,            // matches header use for consistent sizing
  className = '',
  title = 'Notifications',
  style = {},
  ...rest
}) {
  const src = on ? IconOn : IconOff;

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={title}
      title={title}
      className={className}
      style={{ display: 'inline-block', width: size, height: size, ...style }}
      {...rest}
    />
  );
}
