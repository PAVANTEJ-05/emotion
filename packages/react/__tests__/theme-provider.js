/** @jsx jsx */
import 'test-utils/setup-env'
import { ignoreConsoleErrors } from 'test-utils'
import { jsx, ThemeProvider } from '@emotion/react'
import renderer from 'react-test-renderer'
import { act } from 'react'
import cases from 'jest-in-case'

test('nested provider', async () => {
  const tree = (
    await act(() =>
      renderer.create(
        <ThemeProvider theme={{ color: 'hotpink', padding: 4 }}>
          <ThemeProvider
            theme={{ backgroundColor: 'darkgreen', color: 'white' }}
          >
            <div
              css={({ color, padding, backgroundColor }) => ({
                color,
                padding,
                backgroundColor
              })}
            />
          </ThemeProvider>
        </ThemeProvider>
      )
    )
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

test('nested provider with function', async () => {
  const tree = (
    await act(() =>
      renderer.create(
        <ThemeProvider theme={{ color: 'hotpink', padding: 4 }}>
          <ThemeProvider
            theme={theme => ({
              backgroundColor: 'darkgreen',
              ...theme,
              padding: 8
            })}
          >
            <div
              css={({ color, padding, backgroundColor }) => ({
                color,
                padding,
                backgroundColor
              })}
            />
          </ThemeProvider>
        </ThemeProvider>
      )
    )
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

cases(
  'ThemeProvider throws the correct errors',
  ({ value }) => {
    ignoreConsoleErrors(() => {
      return expect(
        act(() =>
          renderer.create(
            <ThemeProvider theme={{ color: 'hotpink', padding: 4 }}>
              <ThemeProvider theme={value}>
                <div
                  css={({ color, padding, backgroundColor }) => ({
                    color,
                    padding,
                    backgroundColor
                  })}
                />
              </ThemeProvider>
            </ThemeProvider>
          )
        )
      ).rejects.toThrowErrorMatchingSnapshot()
    })
  },
  {
    boolean: {
      value: true
    },
    array: {
      value: ['something']
    },
    'func to undefined': {
      value: () => undefined
    },
    undefined: {
      value: undefined
    },
    null: {
      value: null
    }
  }
)
