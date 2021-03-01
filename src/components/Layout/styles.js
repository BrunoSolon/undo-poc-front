import styled from "styled-components";

export const Container = styled.div`
  background: #fff;
`;

export const Wrapper = styled.div`
  background: #fff;
  height: 100vh;
  margin: 0 auto;
  width: min(1280px, 100%);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InputBox = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 600px;

  margin: 0 auto;
  padding: 10px 10px;
  align-items: center;
  justify-content: space-between;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;

  height: 400px;
  min-width: 600px;

  margin: 0 auto;
  padding: 10px 10px;
  align-items: center;

  border: 1px solid black;
  border-radius: 4px;

  overflow-y: auto;
  box-sizing: border-box;
`;

export const ButtonDiv = styled.div`
  outline: 0;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;

  :hover {
    background: var(--white);
  }
`;
