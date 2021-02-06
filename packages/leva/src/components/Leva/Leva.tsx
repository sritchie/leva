import React, { useMemo, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { store } from '../../store'
import { buildTree } from './tree'
import { TreeWrapper } from '../Folder'

import { useDeepMemo, useTransform, useVisiblePaths } from '../../hooks'

import { Root } from './StyledLeva'
import { mergeTheme, globalStyles } from '../../styles'
import { ThemeContext, StoreContext } from '../../context'
import { TitleWithFilter } from './Filter'

let rootInitialized = false

export function Leva({
  theme = {},
  fillParent = false,
  collapsed = false,
  oneLineLabels = false,
  hideTitleBar = false,
}) {
  // data
  const paths = useVisiblePaths(store)
  const [filter, setFilter] = useState('')
  const tree = useMemo(() => buildTree(paths, filter), [paths, filter])

  // theme
  globalStyles()
  const { mergedTheme, themeCss } = useDeepMemo(() => mergeTheme(theme), [theme])

  // drag
  const [rootRef, set] = useTransform<HTMLDivElement>()

  // collapsible
  const [toggled, setToggle] = useState(!collapsed)

  // TODO check if using useEffect is the right hook (we used useLayoutEffect before)
  useEffect(() => {
    rootInitialized = true
  }, [])

  // this generally happens on first render.
  if (paths.length < 1) return null

  return (
    <ThemeContext.Provider value={mergedTheme}>
      <Root ref={rootRef} className={themeCss} fillParent={fillParent} oneLineLabels={oneLineLabels}>
        {!hideTitleBar && (
          <TitleWithFilter onDrag={set} setFilter={setFilter} toggle={() => setToggle((t) => !t)} toggled={toggled} />
        )}
        <StoreContext.Provider value={store}>
          <TreeWrapper isRoot tree={tree} toggled={toggled} />
        </StoreContext.Provider>
      </Root>
    </ThemeContext.Provider>
  )
}

export function useRenderRoot() {
  useEffect(() => {
    if (!rootInitialized) {
      const rootEl = document.createElement('div')
      if (document.body) {
        document.body.appendChild(rootEl)
        ReactDOM.render(<Leva />, rootEl)
      }
      rootInitialized = true
    }
  }, [])
}
