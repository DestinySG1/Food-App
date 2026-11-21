import { useEffect, useRef, useState } from 'react'
import { isValidEan } from './diary.js'

// Kamera-Scanner für EAN/UPC-Barcodes. Die Scanner-Bibliothek wird erst geladen,
// wenn der Scanner geöffnet wird, damit die App schnell startet.
export default function Scanner({ onDetected }) {
  const videoRef = useRef(null)
  const [status, setStatus] = useState('starting') // starting | running | denied | unsupported | error
  const [manual, setManual] = useState('')
  const manualValid = isValidEan(manual)

  useEffect(() => {
    let controls = null
    let cancelled = false
    let done = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }
      try {
        const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([
          import('@zxing/browser'),
          import('@zxing/library'),
        ])
        const hints = new Map()
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
        ])
        const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 150 })
        const c = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
          videoRef.current,
          (result, _err, ctrls) => {
            if (!result || done) return
            let code = result.getText()
            if (code.length === 12) code = '0' + code // UPC-A als EAN-13
            if (!isValidEan(code)) return
            done = true
            navigator.vibrate?.(60)
            ctrls.stop()
            onDetected(code)
          },
        )
        controls = c
        if (cancelled) c.stop()
        else setStatus('running')
      } catch (err) {
        if (cancelled) return
        const name = err?.name || ''
        setStatus(name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : name === 'NotFoundError' ? 'unsupported' : 'error')
      }
    }
    start()
    return () => {
      cancelled = true
      controls?.stop()
    }
  }, [onDetected])

  return (
    <section className="scanner">
      <div className={`viewfinder ${status === 'running' ? 'live' : ''}`}>
        <video ref={videoRef} muted playsInline />
        {status === 'running' && <div className="scan-frame" aria-hidden="true"><span className="scan-line" /></div>}
        {status !== 'running' && (
          <div className="viewfinder-msg">
            {status === 'starting' && 'Kamera wird gestartet …'}
            {status === 'denied' && 'Kein Zugriff auf die Kamera. Erlaube ihn in den Browser-Einstellungen oder gib die Nummer unten ein.'}
            {status === 'unsupported' && 'Auf diesem Gerät ist keine Kamera verfügbar. Gib die Nummer unten ein.'}
            {status === 'error' && 'Die Kamera konnte nicht gestartet werden. Gib die Nummer unten ein.'}
          </div>
        )}
      </div>
      {status === 'running' && <p className="muted small center no-margin">Halte den Barcode in den Rahmen.</p>}

      <form
        className="searchbar"
        onSubmit={(e) => {
          e.preventDefault()
          if (manualValid) onDetected(manual.trim())
        }}
      >
        <input
          inputMode="numeric"
          placeholder="Barcode-Nummer eingeben"
          value={manual}
          onChange={(e) => setManual(e.target.value.replace(/\D/g, ''))}
          aria-label="Barcode-Nummer"
          maxLength={13}
        />
        <button type="submit" className="primary small-btn" disabled={!manualValid}>OK</button>
      </form>
    </section>
  )
}
