import styled from '@emotion/styled';

const Title = styled.h1({
  lineHeight: 1.15,
  fontSize: '4rem',
  textAlign: 'center',
  margin: 0,
  padding: '0.5rem',
  width: '100%',
  '@media (max-width: 720px)': {
    fontSize: '3rem',
  },
});

export default Title;
