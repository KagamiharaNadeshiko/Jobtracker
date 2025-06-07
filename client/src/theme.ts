import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0086e6',
      600: '#0069b3',
      700: '#004d80',
      800: '#00304d',
      900: '#00141f',
    },
  },
  fonts: {
    heading: "'Roboto', sans-serif",
    body: "'Open Sans', sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            _disabled: {
              bg: 'brand.500',
            },
          },
          _active: {
            bg: 'brand.700',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        p: '5',
        rounded: 'lg',
        bg: 'white',
        boxShadow: 'md',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        _hover: {
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
        },
      },
    },
  },
});

export default theme; 