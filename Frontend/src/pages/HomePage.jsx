import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from "react-router-dom"

/**
 * Home page
 * @returns 
 */
const HomePage = () => {
    const navigate = useNavigate()

    const goToNewPage = (link) => {
        navigate(link)
    }

    return (
        <div className="bottom-part">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Welcome to NeutrinoReview</Typography>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum vehicula aliquet. In maximus non eros quis tempus. Fusce leo metus, dapibus quis ullamcorper sed, sollicitudin nec urna. Pellentesque commodo nibh et eros ultricies tempus. Fusce bibendum sed sem eget consequat. Quisque blandit fermentum consequat. Sed quis egestas massa. Fusce ullamcorper lacus id magna scelerisque, sed iaculis mauris rutrum. Aliquam facilisis, enim ut molestie varius, tellus est pretium eros, eu rhoncus sem ex a turpis. Sed ultricies eleifend nibh eget fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum vehicula aliquet. In maximus non eros quis tempus. Fusce leo metus, dapibus quis ullamcorper sed, sollicitudin nec urna. Pellentesque commodo nibh et eros ultricies tempus. Fusce bibendum sed sem eget consequat. Quisque blandit fermentum consequat. Sed quis egestas massa. Fusce ullamcorper lacus id magna scelerisque, sed iaculis mauris rutrum. Aliquam facilisis, enim ut molestie varius, tellus est pretium eros, eu rhoncus sem ex a turpis. Sed ultricies eleifend nibh eget fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum vehicula aliquet. In maximus non eros quis tempus. Fusce leo metus, dapibus quis ullamcorper sed, sollicitudin nec urna. Pellentesque commodo nibh et eros ultricies tempus. Fusce bibendum sed sem eget consequat. Quisque blandit fermentum consequat. Sed quis egestas massa. Fusce ullamcorper lacus id magna scelerisque, sed iaculis mauris rutrum. Aliquam facilisis, enim ut molestie varius, tellus est pretium eros, eu rhoncus sem ex a turpis. Sed ultricies eleifend nibh eget fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum vehicula aliquet. In maximus non eros quis tempus. Fusce leo metus, dapibus quis ullamcorper sed, sollicitudin nec urna. Pellentesque commodo nibh et eros ultricies tempus. Fusce bibendum sed sem eget consequat. Quisque blandit fermentum consequat. Sed quis egestas massa. Fusce ullamcorper lacus id magna scelerisque, sed iaculis mauris rutrum. Aliquam facilisis, enim ut molestie varius, tellus est pretium eros, eu rhoncus sem ex a turpis. Sed ultricies eleifend nibh eget fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum vehicula aliquet. In maximus non eros quis tempus. Fusce leo metus, dapibus quis ullamcorper sed, sollicitudin nec urna. Pellentesque commodo nibh et eros ultricies tempus. Fusce bibendum sed sem eget consequat. Quisque blandit fermentum consequat. Sed quis egestas massa. Fusce ullamcorper lacus id magna scelerisque, sed iaculis mauris rutrum. Aliquam facilisis, enim ut molestie varius, tellus est pretium eros, eu rhoncus sem ex a turpis. Sed ultricies eleifend nibh eget fringilla.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum vehicula aliquet. In maximus non eros quis tempus. Fusce leo metus, dapibus quis ullamcorper sed, sollicitudin nec urna. Pellentesque commodo nibh et eros ultricies tempus. Fusce bibendum sed sem eget consequat. Quisque blandit fermentum consequat. Sed quis egestas massa. Fusce ullamcorper lacus id magna scelerisque, sed iaculis mauris rutrum. Aliquam facilisis, enim ut molestie varius, tellus est pretium eros, eu rhoncus sem ex a turpis. Sed ultricies eleifend nibh eget fringilla.
            </p>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                <Button onClick={() => goToNewPage("/dashboard")} variant="contained" sx={{ 'backgroundColor': 'rgb(59, 82, 187)' }}>Dashboard</Button>
                <Button onClick={() => goToNewPage("/user-guide")} variant="contained" sx={{ 'backgroundColor': 'rgb(59, 82, 187)' }}>User Guide</Button>
            </Box>
        </div>
    )
}

export default HomePage