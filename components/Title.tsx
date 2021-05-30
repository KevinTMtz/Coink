import styled from '@emotion/styled';

const Title = styled.h1({
  lineHeight: 1.15,
  fontSize: '5vw',
  textAlign: 'center',
  margin: 0,
  padding: '0.5rem',
  width: '100%',
  '@media (max-width: 600px)': {
    fontSize: '12vw',
  },
});

export default Title;
