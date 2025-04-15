
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Textarea 
} from "@/components/ui/textarea";
import {
  Switch
} from "@/components/ui/switch";
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const platformSettingsSchema = z.object({
  platform_name: z.string().min(2, {
    message: "Nama platform harus minimal 2 karakter.",
  }),
  platform_description: z.string(),
  commission_rate: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, {
    message: "Persentase komisi harus diantara 0 dan 100.",
  }),
  maintenance_mode: z.boolean().default(false),
  enable_bookings: z.boolean().default(true),
  enable_wallet: z.boolean().default(true),
});

const emailSettingsSchema = z.object({
  smtp_host: z.string(),
  smtp_port: z.string(),
  smtp_user: z.string().email({
    message: "Harap masukkan email yang valid.",
  }),
  smtp_password: z.string(),
  sender_email: z.string().email({
    message: "Harap masukkan email yang valid.",
  }),
  sender_name: z.string(),
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState('platform');

  const platformForm = useForm<z.infer<typeof platformSettingsSchema>>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platform_name: "KlikJasa",
      platform_description: "Platform untuk menghubungkan penyedia layanan lokal dan konsumen",
      commission_rate: "5",
      maintenance_mode: false,
      enable_bookings: true,
      enable_wallet: true,
    },
  });

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtp_host: "",
      smtp_port: "",
      smtp_user: "",
      smtp_password: "",
      sender_email: "",
      sender_name: "",
    },
  });

  function onPlatformSubmit(values: z.infer<typeof platformSettingsSchema>) {
    // In a real app, we would save this to the database
    console.log(values);
    toast.success("Pengaturan platform berhasil disimpan");
  }

  function onEmailSubmit(values: z.infer<typeof emailSettingsSchema>) {
    // In a real app, we would save this to the database
    console.log(values);
    toast.success("Pengaturan email berhasil disimpan");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
          <CardDescription>Kelola pengaturan platform KlikJasa</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="appearance">Tampilan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="platform" className="mt-6">
              <Form {...platformForm}>
                <form onSubmit={platformForm.handleSubmit(onPlatformSubmit)} className="space-y-6">
                  <FormField
                    control={platformForm.control}
                    name="platform_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Platform</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Nama yang akan ditampilkan kepada pengguna.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={platformForm.control}
                    name="platform_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Platform</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Deskripsi singkat tentang platform" 
                            className="resize-none" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={platformForm.control}
                    name="commission_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Persentase Komisi (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" max="100" />
                        </FormControl>
                        <FormDescription>
                          Persentase komisi yang diambil dari setiap transaksi.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormField
                      control={platformForm.control}
                      name="maintenance_mode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Mode Pemeliharaan</FormLabel>
                            <FormDescription>
                              Aktifkan mode pemeliharaan untuk menonaktifkan sementara platform.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={platformForm.control}
                      name="enable_bookings"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Aktifkan Booking</FormLabel>
                            <FormDescription>
                              Izinkan pengguna untuk membuat booking layanan.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={platformForm.control}
                      name="enable_wallet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Aktifkan Wallet</FormLabel>
                            <FormDescription>
                              Izinkan pengguna untuk menggunakan fitur wallet.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Simpan Pengaturan</Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="email" className="mt-6">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={emailForm.control}
                      name="smtp_host"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Host</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="smtp.example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtp_port"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Port</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="587" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={emailForm.control}
                      name="smtp_user"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP User</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="user@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="smtp_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SMTP Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="••••••••" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={emailForm.control}
                      name="sender_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Pengirim</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="noreply@klikjasa.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={emailForm.control}
                      name="sender_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Pengirim</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="KlikJasa" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Simpan Pengaturan Email</Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-6">
              <div className="rounded-md border p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Pengaturan Tampilan</h3>
                <p className="text-muted-foreground mb-4">
                  Pengaturan tampilan akan segera tersedia dalam pembaruan berikutnya.
                </p>
                <Button variant="secondary" disabled>Fitur Belum Tersedia</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
