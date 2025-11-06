/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect, forwardRef } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

// ... (all code from your Dither component above)

export default Dither;
