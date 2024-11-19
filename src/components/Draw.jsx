import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogContent,
    DialogActions,
} from '@mui/material';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';
import { supabase } from '../supabaseConfig';
import { useParams } from 'react-router-dom';

function Draw() {
    const { eventId } = useParams();
    const [draw, setDraw] = useState(null);
    const [winners, setWinners] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentName, setCurrentName] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchDraw();
    }, [eventId]);

    useEffect(() => {
        if (draw) {
            fetchWinners();
            fetchAttendees();
        }
    }, [draw]);

    const fetchDraw = async () => {
        try {
            const { data, error } = await supabase
                .from('draw')
                .select('*')
                .eq('draw_event_id', eventId)
                .single();

            if (error) throw error;
            setDraw(data);
        } catch (error) {
            console.error('Error fetching draw:', error.message);
        }
    };

    const fetchWinners = async () => {
        if (!draw) return;
        try {
            const { data, error } = await supabase
                .from('winners')
                .select('*, person (person_name, person_lastname, person_ci)')
                .eq('winner_draw_id', draw.id);

            if (error) throw error;
            setWinners(data);
        } catch (error) {
            console.error('Error fetching winners:', error.message);
        }
    };

    const fetchAttendees = async () => {
        try {
            const { data: attendees, error } = await supabase
                .from('attendance')
                .select('*, person (person_name, person_lastname, person_ci, id)')
                .eq('attendance_event_id', draw.draw_event_id);

            if (error) throw error;
            setAttendees(attendees);
        } catch (error) {
            console.error('Error fetching attendees:', error.message);
        }
    };

    const handleDrawWinner = async () => {
        if (attendees.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No hay asistentes',
                text: 'No hay personas asistentes disponibles para realizar el sorteo.',
            });
            return;
        }
    
        setIsDrawing(true);
        setOpenDialog(true);
    
        const duration = 10000; // Duración del efecto en milisegundos
        const intervalTime = 100; // Intervalo de cambio de nombre
    
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * attendees.length);
            const randomAttendee = attendees[randomIndex];
            setCurrentName(`${randomAttendee.person.person_name} ${randomAttendee.person.person_lastname}`);
        }, intervalTime);
    
        const findUniqueWinner = () => {
            const randomIndex = Math.floor(Math.random() * attendees.length);
            const candidate = attendees[randomIndex];
    
            // Verificar si el candidato ya es ganador
            const isDuplicate = winners.some((w) => w.winner_person_id === candidate.person.id);
    
            return isDuplicate ? findUniqueWinner() : candidate;
        };
    
        setTimeout(async () => {
            clearInterval(interval);
    
            try {
                const winner = findUniqueWinner();
                const winnerPersonId = winner.person?.id;
    
                if (!winnerPersonId) {
                    throw new Error('El ID de la persona ganadora es inválido.');
                }
    
                // Guardar ganador en la tabla winners
                const { error } = await supabase.from('winners').insert([{
                    winner_draw_id: draw.id,
                    winner_person_id: winnerPersonId,
                }]);
    
                if (error) throw error;
    
                setWinners((prev) => [
                    ...prev,
                    { winner_person_id: winnerPersonId, person: winner.person },
                ]);
                setAttendees((prev) => prev.filter((a) => a.person.id !== winnerPersonId));
    
                setShowConfetti(true);
    
                // Mostrar Swal y cerrar el diálogo
                setOpenDialog(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Ganador seleccionado',
                    text: `${winner.person.person_name} ${winner.person.person_lastname} (CI: ${winner.person.person_ci}) ha sido seleccionado como ganador.`,
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al realizar el sorteo',
                    text: error.message,
                });
            } finally {
                setIsDrawing(false);
                setCurrentName('');
                setTimeout(() => setShowConfetti(false), 5000); // Detener el confeti después de 5 segundos
            }
        }, duration);
    };
    

    return (
        <Box sx={{ maxWidth: '95%', margin: '0 auto', mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Sorteos del Evento
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Apellido</TableCell>
                        <TableCell>Cédula</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {winners.length > 0 ? (
                        winners.map((winner) => (
                            <TableRow key={winner.winner_person_id}>
                                <TableCell>{winner.person.person_name}</TableCell>
                                <TableCell>{winner.person.person_lastname}</TableCell>
                                <TableCell>{winner.person.person_ci}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                Aún no hay ganadores.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleDrawWinner}
                    disabled={!draw || attendees.length === 0 || isDrawing}
                >
                    Sortear
                </Button>
            </Box>

            <Dialog open={openDialog} fullWidth maxWidth="sm">
                <DialogContent>
                    {isDrawing && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '150px',
                                background: 'linear-gradient(45deg, #ff6f61, #ffde59)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '2rem',
                                animation: 'bounce 2s infinite',
                            }}
                        >
                            {currentName || 'Preparando...'}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {showConfetti && <Confetti />}
        </Box>
    );
}

export default Draw;
