import React from 'react'
import { act } from 'react'
import testRenderer from 'react-test-renderer'
import { ThemeProvider } from '@emotion/react'
import styled, { css } from '@emotion/native'
import reactNative from 'react-native'

const StyleSheet = reactNative.StyleSheet

jest.mock('react-native')

console.error = jest.fn()

const theme = { backgroundColor: 'magenta', display: 'flex' }

describe('Emotion native styled', () => {
  test('should not throw an error when used valid primitive', () => {
    expect(() => styled.Text({})).not.toThrow()
  })

  test('should throw an error when used invalid primitive', () => {
    expect(() => styled.TEXT({})).toThrow()
  })

  test('should render the primitive when styles applied using object style notation', async () => {
    const Text = styled.Text`
      color: red;
      font-size: 20px;
      background-color: ${props => props.back};
    `
    const tree = (
      await act(() =>
        testRenderer.create(
          <Text style={{ fontSize: 40 }} back="red">
            Emotion Primitives
          </Text>
        )
      )
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should work with theming from @emotion/react', async () => {
    const Text = styled.Text`
      color: ${props => props.theme.backgroundColor};
    `

    const tree = (
      await act(() =>
        testRenderer.create(
          <ThemeProvider theme={theme}>
            <Text>Hello World</Text>
          </ThemeProvider>
        )
      )
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('should render the primitive on changing the props', async () => {
    const Text = styled.Text({ padding: '20px' }, props => ({
      color: props.decor
    }))
    const tree = (
      await act(() =>
        testRenderer.create(<Text decor="hotpink">Emotion Primitives</Text>)
      )
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render primitive with style prop', async () => {
    const Title = styled.Text`
      color: hotpink;
    `
    const tree = (
      await act(() =>
        testRenderer.create(
          <Title style={{ padding: 10 }}>Emotion primitives</Title>
        )
      )
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should work with StyleSheet.create API', async () => {
    const styles = StyleSheet.create({ foo: { color: 'red' } })
    const Text = styled.Text`
      font-size: 10px;
    `
    const tree = (
      await act(() =>
        testRenderer.create(<Text style={styles.foo}>Emotion primitives</Text>)
      )
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('primitive should work with `withComponent`', async () => {
    const Text = styled.Text`
      color: ${props => props.decor};
    `
    const Name = Text.withComponent(reactNative.Text)
    const tree = (
      await act(() => testRenderer.create(<Name decor="hotpink">Mike</Name>))
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should style any other component', async () => {
    const Text = styled.Text`
      color: hotpink;
    `
    const Title = () => <Text>Hello World</Text>
    const StyledTitle = styled(Title)`
      font-size: 20px;
      font-style: ${props => props.sty};
    `
    const tree = (
      await act(() => testRenderer.create(<StyledTitle sty="italic" />))
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should pass props in withComponent', async () => {
    const ViewOne = styled.View`
      background-color: ${props => props.color};
    `
    const treeOne = await act(() =>
      testRenderer.create(<ViewOne color="green" />)
    )
    const ViewTwo = ViewOne.withComponent(reactNative.Text)
    const treeTwo = await act(() =>
      testRenderer.create(<ViewTwo color="hotpink" />)
    )

    expect(treeOne).toMatchSnapshot()
    expect(treeTwo).toMatchSnapshot()
  })

  test('should render <Image />', async () => {
    const Image = styled.Image`
      border-radius: 2px;
    `
    const tree = (
      await act(() =>
        testRenderer.create(
          <Image
            source={{
              uri: 'https://camo.githubusercontent.com/209bdea972b9b6ef90220c59ecbe66d35ffefa8a/68747470733a2f2f63646e2e7261776769742e636f6d2f746b6834342f656d6f74696f6e2f6d61737465722f656d6f74696f6e2e706e67',
              height: 150,
              width: 150
            }}
          />
        )
      )
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test('Log error message if units are not specified when using shorthand properties', async () => {
    const Text = styled.Text`
      margin: 20px;
      padding: 20;
    `

    await act(() => testRenderer.create(<Text>Hello World</Text>))

    expect(console.error).toBeCalledWith(
      "'padding' shorthand property requires units for example - padding: 20px or padding: 10px 20px 40px 50px"
    )
  })

  test('should render styles correctly from all nested style factories', async () => {
    const bgColor = color => css`
      background-color: ${color};
    `

    const Text = styled.Text`
      color: hotpink;
      ${({ backgroundColor }) => bgColor(backgroundColor)};
    `

    const tree = (
      await act(() =>
        testRenderer.create(<Text backgroundColor="blue">Hello World</Text>)
      )
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
