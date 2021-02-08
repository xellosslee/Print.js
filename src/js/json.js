import { capitalizePrint, addHeader } from './functions'
import Print from './print'

const Json = {
  print: (params, printFrame) => {
    // Check if we received proper data
    if (typeof params.printable !== 'object') {
      throw new Error('Invalid javascript data object (JSON).')
    }

    // Validate repeatTableHeader
    if (typeof params.repeatTableHeader !== 'boolean') {
      throw new Error('Invalid value for repeatTableHeader attribute (JSON).')
    }

    // Validate properties
    if (!params.properties || !Array.isArray(params.properties)) {
      throw new Error('Invalid properties array for your JSON data.')
    }

    // Create a print container element
    params.printableElement = document.createElement('div')

    // Check if we are adding a print header
    if (params.header) {
      addHeader(params.printableElement, params)
    }

    // Build the printable html data
    params.printableElement.innerHTML += Json.jsonToHTML(params)

    // Print the json data
    Print.send(params, printFrame)
  },

  jsonToHTML: function(params) {
    // Get the row and column data
    const data = params.printable
    // We will format the property objects to keep the JSON api compatible with older releases
    const properties = params.properties.map(property => {
      return {
        field: typeof property === 'object' ? property.field : property,
        displayName: typeof property === 'object' ? property.displayName : property,
        columnSize: typeof property?.columnSize === 'number' ? ('width:' + property.columnSize + 'px;') : ('width:' + (100 / params.properties.length) + '%;'),
        align: typeof property?.align === 'string' ? ('text-align:' + property.align + ';') : '',
        headerAlign: typeof property?.headerAlign === 'string' ? ('text-align:' + property.headerAlign + ';') : '',
      }
    })
    // Create a html table
    let htmlData = '<table style="border-collapse: collapse; width: 100%;">'
  
    // Check if the header should be repeated
    if (params.repeatTableHeader) {
      htmlData += '<thead>'
    }
  
    // Add the table header row
    htmlData += '<tr>'
  
    // Add the table header columns
    for (let n = 0; n < properties.length; n++) {
      htmlData += '<th style="' + properties[n].columnSize + params.gridHeaderStyle + properties[n].headerAlign + '">' + capitalizePrint(properties[n].displayName) + '</th>'
    }
  
    // Add the closing tag for the table header row
    htmlData += '</tr>'
  
    // If the table header is marked as repeated, add the closing tag
    if (params.repeatTableHeader) {
      htmlData += '</thead>'
    }
  
    // Create the table body
    htmlData += '<tbody>'
  
    // Add the table data rows
    for (let i = 0; i < data.length; i++) {
      // Add the row starting tag
      htmlData += '<tr>'
  
      // Print selected properties only
      for (let n = 0; n < properties.length; n++) {
        let stringData = data[i]
  
        // Support nested objects
        const property = properties[n].field.split('.')
        if (property.length > 1) {
          for (let p = 0; p < property.length; p++) {
            stringData = stringData[property[p]] == null ? '' : stringData[property[p]]
          }
        } else {
          stringData = stringData[properties[n].field] == null ? '' : stringData[properties[n].field]
        }
  
        // Add the row contents and styles
        htmlData += '<td style="' + properties[n].columnSize + '"><div style="' + params.gridStyle + properties[n].align + '">' + stringData + '</div></td>'
      }
  
      // Add the row closing tag
      htmlData += '</tr>'
    }
  
    // Add the table and body closing tags
    htmlData += '</tbody></table>'
  
    return htmlData
  } 
}

export default Json