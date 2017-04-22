import { Component } from 'preact'
import Layout from 'components/Layout'
import setBridge from 'store/actions/setBridge'
import store, { subscribe } from 'store'

class Settings extends Component {
  toggleDarkMode () {
    document.body.classList.toggle('dark')
  }

  closeConnection () {
    store.dispatch(setBridge({}))
  }

  render ({ settings }) {
    return (
      <Layout>
        <ul>
          <li>
            <small>Host</small>
            {settings.host}
          </li>
          <li>
            Dark mode
            <input
              onClick={this.toggleDarkMode}
              checked={document.body.classList.contains('dark')}
              style={{ float: 'right' }}
              type='checkbox'
            />
            {settings.darkMode}
          </li>
          <li>
            <a onClick={this.closeConnection.bind(this)}>Close Connection</a>
          </li>
        </ul>
      </Layout>
    )
  }
}

export default subscribe(Settings)