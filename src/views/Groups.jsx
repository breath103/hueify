import { Component } from 'preact'
import Layout from 'components/Layout'
import Slider from 'components/Slider'
import ColorWheel from 'components/ColorWheel'
import { subscribe } from 'store'
import { lightState } from 'node-hue-api'
import connectToHue from 'helpers/connectToHue'
import debounce from 'debounce'

class Groups extends Component {
  /**
   * State
   * @type {Object}
   */
  state = {
    colorWheel: false,
    currentLightGroup: null
  }

  /**
   * Set group brigthness
   * @param  {Object} group
   * @param  {Object} event
   * @private
   */
  setGroupBrightness (group, event) {
    this.props.api.setGroupLightState(
        group.id,
        lightState.create().transitionFast().bri(event.target.value)
      )
      .done()
  }

  /**
   * Toggle lights on/off
   * @param  {Object} group
   * @private
   */
  toggleLights (group) {
    this.props.api.setGroupLightState(
        group.id,
        lightState.create().on(!group.action.on)
      )
      .done(this.props.api.updateState)
  }

  /**
   * Set groups light color
   * @param  {Array} rgb
   */
  setColor (rgb) {
    for (let light of this.state.currentLightGroup.lights) {
      this.props.api.setLightState(
          light,
          lightState.create().rgb(...rgb)
        )
        .done()
    }
  }

  /**
   * Open the color wheel and set the selected group
   * @param  {Object} group
   * @private
   */
  openColorWheel (group) {
    this.setState({
      colorWheel: true,
      currentLightGroup: group
    })
  }

  /**
   * Close the color wheel
   * @private
   */
  closeColorWheel () {
    this.setState({
      colorWheel: false,
      currentLightGroup: null
    })
  }

  /**
   * Render light groups
   * @param  {Object} props
   * @return {JSX}
   * @public
   */
  render ({ groups }) {
    return (
      <Layout>
        <ul>
          {groups.map(group => this.renderListItem(group))}
        </ul>
        <ColorWheel
          show={this.state.colorWheel}
          onChange={this.setColor.bind(this)}
          onClose={this.closeColorWheel.bind(this)}
        />
      </Layout>
    )
  }

  /**
   * Render list item
   * @param {Object} group
   * @return {JSX}
   * @private
   */
  renderListItem (group) {
    if (group.id === '0') {
      return null
    }

    return (
      <li key={group.id}>
        <span>
          <span onClick={this.openColorWheel.bind(this, group)}>
            {group.name}
          </span>
          <input
            type='checkbox'
            style={{ float: 'right', cursor: 'pointer' }}
            onChange={this.toggleLights.bind(this, group)}
            checked={group.action.on}
          />
        </span>
        <Slider
          min='0'
          max='255'
          value={group.action.bri}
          onInput={debounce(this.setGroupBrightness.bind(this, group), 200)}
        />
      </li>
    )
  }
}

export default subscribe(connectToHue(Groups))