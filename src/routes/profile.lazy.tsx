import React, { useState } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import { createLazyFileRoute } from '@tanstack/react-router';
import Navbar from '@/components/common/navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormattedMessage } from 'react-intl';
import { CreateWithdrawRequest, FetchUserWithdrawlRequest, userProfile } from '@/services/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { USER_PROFILE } from '@/lib/constants';
import useProfile from '@/hooks/useProfile';
const Profile = () => {
  const [amount, setAmount] = useState(0);
  const { userId } = useProfile();
  const [open, setOpen] = useState(false);
  //   const userId = localStorage.getItem('userId');
  const { isLoading: isLoading3, data: userDetail } = useQuery({
    queryKey: [USER_PROFILE],
    queryFn: () => userProfile(userId),
    enabled: !!userId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
  const { isLoading: isLoading4, data: fetchwithdrawlrequest } = useQuery({
    queryKey: ['WITHDRAWL_REQUEST'],
    queryFn: () => FetchUserWithdrawlRequest({ id: userId }),
    enabled: !!userId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });
  const [bankDetails, setBankDetails] = useState({
    // amount: '',
    from: '',
    bankBranch: '',
    depositorBankName: '',
    depositorName: '',
    depositorBankAcctNo: '',
  });
  const { mutateAsync: withdrawlrequest, isPending: withdrawrequestpending } = useMutation({
    mutationFn: CreateWithdrawRequest,
  });
  const handlewithdrawlrequest = async () => {
    try {
      const reponse = await withdrawlrequest({
        amount,
        from: localStorage.getItem('userId'),
        bankBranch: bankDetails.bankBranch,
        depositorBankName: bankDetails.depositorBankName,
        depositorName: bankDetails.depositorName,
        depositorBankAcctNo: bankDetails.depositorBankAcctNo,
      });
      toast.success('Yêu cầu rút tiền đã được gửi.');
      setOpen(false)
    } catch (e: { message: string }) {
      toast.error(e.message);
    }

    // if(reponse.status)
  };
  console.log(fetchwithdrawlrequest);
  return (
    <div className="dealer-container">
      <div
        className=" bg-auto bg-no-repeat bg-center bg-cover bg-[url('/game.png')] relative "
        style={{
          height: '100vh',
        }}
      >
        <div className="flex flex-col ">
          <Navbar />;
        </div>
        <div className="flex justify-center items-center">
          <Tabs defaultValue="account" className="w-[600px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">
                {' '}
                <FormattedMessage id="app.account" />
              </TabsTrigger>
              <TabsTrigger value="withdrawl">
                {' '}
                <FormattedMessage id="app.withdrawlrequest" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="app.account" />
                  </CardTitle>
                  <CardDescription>
                    <FormattedMessage id="app.accountdesc" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">
                      <FormattedMessage id="app.username" />
                    </Label>
                    <Input id="name" defaultValue={localStorage.getItem('username')} disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="username">
                      <FormattedMessage id="app.telegramusername" />
                    </Label>
                    <Input id="username" defaultValue={localStorage.getItem('telegramusername')} disabled />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">
                      {' '}
                      <FormattedMessage id="app.currentpass" disabled />
                    </Label>
                    <Input id="current" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">
                      {' '}
                      <FormattedMessage id="app.newpass" disabled />
                    </Label>
                    <Input id="new" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="withdrawl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <p>
                      {' '}
                      <FormattedMessage id="app.withdrawlrequest" />
                    </p>{' '}
                    <Dialog open={open} onOpenChange={setOpen}>
                      {' '}
                      <DialogTrigger asChild>
                        <Button>
                          {' '}
                          <FormattedMessage id="app.withdrawlrequest" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {' '}
                            <FormattedMessage id="app.withdrawlrequest" />
                          </DialogTitle>
                          <DialogDescription>
                            <FormattedMessage id="app.withdrawldescription" />
                          </DialogDescription>
                        </DialogHeader>
                        <label>
                          {' '}
                          <FormattedMessage id="app.amount" />
                        </label>
                        <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
                        <label>
                          {' '}
                          <FormattedMessage id="app.branchname" />
                        </label>
                        <Input
                          type="text"
                          onChange={(e) => setBankDetails({ ...bankDetails, bankBranch: e.target.value })}
                        />
                        <label>
                          {' '}
                          <FormattedMessage id="app.bankname" />
                        </label>
                        <Input
                          type="text"
                          onChange={(e) => setBankDetails({ ...bankDetails, depositorBankName: e.target.value })}
                        />
                        <label>
                          {' '}
                          <FormattedMessage id="app.name" />
                        </label>
                        <Input
                          type="text"
                          onChange={(e) => setBankDetails({ ...bankDetails, depositorName: e.target.value })}
                        />
                        <label>
                          {' '}
                          <FormattedMessage id="app.accountnumber" />
                        </label>
                        <Input
                          type="text"
                          onChange={(e) => setBankDetails({ ...bankDetails, depositorBankAcctNo: e.target.value })}
                        />
                        <Button
                          onClick={() => handlewithdrawlrequest()}
                          className="w-full buttoncss"
                          disabled={withdrawrequestpending}
                        >
                          {withdrawrequestpending ? (
                            <span className="flex items-center gap-x-1">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <FormattedMessage id="app.depositpending" />
                            </span>
                          ) : (
                            <FormattedMessage id="app.submit" />
                          )}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormattedMessage id="app.tabledesc" />
                  <Table>
                    <TableCaption></TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          {' '}
                          <FormattedMessage id="app.withdrawlno" />
                        </TableHead>
                        <TableHead>
                          {' '}
                          <FormattedMessage id="app.status" />
                        </TableHead>
                        <TableHead className="text-right">
                          {' '}
                          <FormattedMessage id="app.amount" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fetchwithdrawlrequest?.message?.length > 0 ? (
                        fetchwithdrawlrequest?.message?.map((invoice, index) => (
                          <TableRow key={invoice._id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            {/* <TableCell>{invoice.amount}</TableCell> */}
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell className="text-right">{invoice.amount}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>No Data Found</TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export const Route = createLazyFileRoute('/profile')({
  component: () => (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  ),
});
