import React from 'react'
import { File } from '../File'

describe('File', () => {
  let component

  beforeEach(() => {
    component = shallow(
      <File />
    )
  })

  it('should render', () => {
    expect(component.type()).to.eql('div')
  })
})
