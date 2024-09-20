import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"

export interface AlertProps { 
	status?: 'error' | 'success',
	message?: string
}

export default function DefaultAlert(props: AlertProps) {
	return (
		<div className="fixed bottom-4 right-4 z-50 max-w-sm">
			<Alert variant={props.status == 'error' ? 'destructive' : 'default' }>
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>
					{props.message}
				</AlertDescription>
			</Alert>
		</div>
	)
}