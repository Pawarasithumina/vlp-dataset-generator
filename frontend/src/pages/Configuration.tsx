import { ConfigurationPanel } from '../components/configuration/ConfigurationPanel'
import { PageHead } from '../components/ui/Primitives'

export default function Configuration() {
  return (
    <div className="page">
      <PageHead title="Configuration" subtitle="Every parameter of the experiment. Physics runs on the backend when you apply and run." />
      <ConfigurationPanel />
    </div>
  )
}
