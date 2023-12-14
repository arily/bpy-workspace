import fs from 'node:fs/promises'
import { formidable } from 'formidable'

const form = formidable({ multiples: true })

export default defineEventHandler(async (event) => {
  const ext = 'pdf' // Output extension.
  const [,parsed] = await form.parse(event.node.req)

  // Read the input file.
  const xlsxBuf = await fs.readFile(parsed.file?.[0].filepath || err('no file'))
  const pdfBuf = await convertAsync(xlsxBuf, ext, undefined)

  event.node.res.writeHead(200, undefined, {
    'content-type': 'application/pdf',
  })
  event.node.res.write(pdfBuf)
  event.node.res.end()
})
