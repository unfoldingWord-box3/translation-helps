import React from 'react'
import { FileManager } from '../FileManager'

describe('FileManager', () => {
  let component

  beforeEach(() => {
    component = shallow(
      <FileManager />
    )
  })

  it('should render', () => {
    expect(component.type()).to.eql('div')
  })
})
