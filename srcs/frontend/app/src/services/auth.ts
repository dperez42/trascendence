export default {
	isAuthenticated() {
		// Comprueba si hay un token en el almacenamiento local
		return !!localStorage.getItem('token');
	}
}