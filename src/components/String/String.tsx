import React from 'react'
import { ValueInput } from '../ValueInput'
import { LevaInputProps } from '../../types/'
import { Label, Row } from '../styles'
import { useInputContext } from '../../context'

export function String() {
  const { label, displayValue, onUpdate, onChange } = useInputContext<LevaInputProps<string>>()
  return (
    <Row input>
      <Label>{label}</Label>
      <ValueInput value={displayValue} onUpdate={onUpdate} onChange={onChange} />
    </Row>
  )
}
