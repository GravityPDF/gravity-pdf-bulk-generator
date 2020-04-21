import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true
})

/* Setup global defaults that our tests/legacy code expect is present */
window.GPDF_BULK_GENERATOR = {
  language: {
    /* ListToggle */
    label: 'Label',
    toggleAll: 'Toggle All',
    /* Log Messages */
    successTitle: 'Success',
    errorTitle: 'Error',
    warningTitle: 'Warning',
    /* Step 1 */
    stepConfigure: 'Configure',
    stepBuild: 'Build',
    stepDownload: 'Download',
    /* Fatal Error */
    fatalErrorTitle: 'Oops...',
    fatalErrorDescription: 'An error occurred which prevented the Bulk Generator from completing!',
    fatalErrorImageAlt: 'Tech boffins at work.',
    fatalErrorInformation: 'Reload the page and try again. If the issue persists, %1$senable Logging%3$s, re-run the generator and then %2$sfill out a support ticket%3$s. One of our tech boffins will be happy to assist.',
    /* Step 1 */
    stepActivePdfEmpty: 'Please select at least one PDF to generate for the entries.'
  },
  plugin_url: 'https://gravitypdf.com',
  admin_url: 'https://gravitypdf.com',
  form_id: '5'
}
