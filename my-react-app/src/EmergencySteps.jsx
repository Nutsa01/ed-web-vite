import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import {Pending, Search, Colorize, More, WavingHand} from '@mui/icons-material';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(33, 242, 78) 0%,rgb(123, 233, 64) 50%,rgb(57, 138, 35) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(35, 186, 25) 0%,rgb(67, 176, 33) 50%,rgb(49, 138, 35) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    },
  }));
  
const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          backgroundImage:
            'linear-gradient( 136deg, rgb(37, 171, 24) 0%, rgb(117, 227, 66) 50%, rgb(51, 200, 130) 100%)',
          boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
      },
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {
          backgroundImage:
            'linear-gradient( 136deg, rgb(37, 171, 24) 0%, rgb(117, 227, 66) 50%, rgb(51, 200, 130) 100%)',
        },
      },
    ],
  }));
  
function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
  
    const icons = {
      1: <Pending />,
      2: <Search/>,
      3: <Colorize />,
      4: <More />,
      5: <WavingHand />,
    };
  
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };
  
const steps = ['Waiting', 'Assessing', 'Investigating', 'Reviewing', 'Discharged'];

function EmergencySteps({status}) {

  let actual_step;

  switch (status) {
    case 'Waiting' :
      actual_step = 0;
      break;
    case 'Assessing' :
      actual_step = 1;
      break;
    case 'Investigating' :
      actual_step = 2;
      break;
    case 'Reviewing' :
      actual_step = 3;
      break;
    case 'Discharged' :
      actual_step = 4;
      break;
  }

  return (
    <Stepper alternativeLabel activeStep={actual_step } connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  );
}

export default EmergencySteps;
