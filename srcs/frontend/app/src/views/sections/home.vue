<template>
    <div>
        <header-web /> <!-- Usar Header en lugar de HomeUser -->
    </div>
</template>

<script>
import headerWeb from '../../components/headers/header-web.vue'


export default {
    name: 'ParentComponent',
    components: {
        headerWeb, // Registrar el componente Header para que puedas usarlo en la plantilla
    }
}
</script>